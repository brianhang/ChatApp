import { Server } from '../core/server';
import { RoomService } from './service';
import { UserDocument } from '../core/interfaces/user-document';
import { Rooms } from "./models/rooms";
import { RoomDocument } from "./interfaces/room-document";
import { RoomUtils } from './utils';
import { Users } from "../core/models/users";

/**
 * The RoomOwnerService allows room owners to manage their rooms.
 */
export class RoomOwnerService {
  /**
   * Constructor which sets up the service dependencies.
   * 
   * @param server The server to receive events from.
   * @param roomService Service for managing room data.
   * @param util Utility functions for rooms.
   */
  constructor(
    private server: Server,
    private roomService: RoomService,
    private util: RoomUtils
  ) {
    this.server.on('roomOwnerKick', (user: UserDocument, data: any) => this.onRequestKick(user, data));
    this.server.on('roomBans', (user: UserDocument) => this.onRequestBanList(user));
    this.server.on('roomOwnerBan', (user: UserDocument, data: any) => this.onRequestBan(user, data));
  }

  /**
   * Called when a room owner wants to kick another user from the room they are
   * in.
   * 
   * @param user The user that is trying to kick the target.
   * @param targetId The ID of that user that should be kicked.
   */
  private onRequestKick(user: UserDocument, targetId: string): void {
    // Make sure the user is the owner of the room they are in.
    const room = user.room;

    if (!room || !user.equals(room.owner)) {
      return;
    }

    // If so, find the target and eject them.
    const target = this.server.users.find(x => x._id.toHexString() === targetId);

    if (target && target.room && target.room.equals(room)) {
      this.util.ejectUser(target);
    }
  }

  /**
   * Called when the user wants to know the banned users in their room. This
   * will send the room bans over. This simply sends the room bans as a list
   * over since the bans field is not normally replicated for users.
   * 
   * @param user The user that requested the bans.
   */
  private onRequestBanList(user: UserDocument): void {
    // Make sure the user is the owner of the room they are in.
    const room = user.room;

    if (!room || !user.equals(room.owner)) {
      return;
    }

    user.emit('roomBans', room.bans || []);
  }

  /**
   * Called when the user wants a particular user banned from their room.
   * 
   * @param user The user that wants to ban another user.
   * @param data Information about the user that should be banned.
   */
  private onRequestBan(user: UserDocument, data: any): void {
    const room = user.room;
    const target: string = (data.target || '').toString();
    const set = !!data.set;

    // Validate the username of the target.
    if (target.length === 0) {
      return;
    }

    // Make sure the user is allowed to add bans.
    if (!room || !user.equals(room.owner)) {
      return;
    }

    // Whether or not the room data was modified and needs to be saved.
    let save = false;

    // Is the ban being added?
    if (set) {
      // Make sure we have a ban list.
      if (!room.bans) {
        room.bans = [];
      }

      // Make sure the ban does not already exist.
      if (!room.bans.find(ban => ban === target)) {
        room.bans.push(target);
        save = true;
      }

      // Eject the target if they are currently in the room.
      const targetUser = this.server.users.find(x => (<any>x).username === target);

      if (targetUser && targetUser.room && targetUser.room.equals(room)) {
        this.util.ejectUser(targetUser);
      }
    // If not, we should try to remove the ban.
    } else if (room.bans) {
      // Filter out the target username from the ban list.
      const oldLength = room.bans.length;
      room.bans = room.bans.filter(ban => ban !== target);

      // Save if the ban list was actually removed.
      save = (oldLength !== room.bans.length);
    }

    // If there was a change, save this change to the database and update
    // the room owner's ban list state.
    if (save) {
      room.save();
      user.emit('roomBans', room.bans);
    }
  }
}