import { Server } from '../core/server';
import { User } from '../core/models/user';
import { Rooms } from './models/rooms';
import { RoomManager } from './manager';
import { RoomDocument } from './interfaces/room-document';
import { RoomUtils } from './utils';
import { UserDocument } from '../core/interfaces/user-document';

export class RoomService {
  // Manager class for the state of rooms.
  private manager: RoomManager;

  private utils: RoomUtils;

  constructor(private server: Server) {
    this.utils = new RoomUtils(this.server);
    this.manager = new RoomManager(server, this.utils);

    this.server.userJoined.subscribe(user => this.onUserJoined(user));
    this.server.userLeft.subscribe(user => this.onUserLeft(user));

    this.server.on('roomAdd', (user: UserDocument, data: any) => this.onRoomAdd(user, data));
    this.server.on('roomJoin', (user: UserDocument, data: any) => this.onRequestJoin(user, data));
    this.server.on('roomLeave', (user: UserDocument) => this.onRequestLeave(user));
  }

  /**
   * Called when a user joins the server. This will send all the rooms to
   * the client.
   * 
   * @param user The user that just joined.
   */
  private onUserJoined(user: UserDocument): void {
    // Load all rooms for the chat server and store it for later use.
    Rooms.find({}).cursor()
      .eachAsync((room: RoomDocument) => this.manager.replicate(room, user));
  }

  /**
   * Called after a user has left the server. This will clear which room the
   * user is in.
   * 
   * @param user The user that just left.
   */
  private onUserLeft(user: UserDocument): void {
    this.utils.ejectUser(user);
  }

  /**
   * Called when the user requests to join a room.
   * 
   * @param user The user that made the request.
   * @param data Information about the requested room.
   */
  private onRequestJoin(user: UserDocument, data: any): void {
    const roomId = (data.roomId || '').toString();

    if (user.room && user.room._id && user.room._id.toHexString() === roomId) {
      return;
    }

    Rooms.findById(roomId, (err, room: RoomDocument) => {
      if (err) {
        console.error(user.nickname + ' tried to join ' + roomId + ': ' + err);

        return;
      }

      user.room = undefined;

      this.server.emit('roomJoin', {
        roomId: room._id,
        userId: user._id
      });

      user.room = room;
      user.save();

      console.log(user.nickname + ' has joined ' + room.name);
    });
  }

  /**
   * Called when the user wants to leave the room they are in. This will
   * eject the user from their room.
   * 
   * @param user The user that wants to leave.
   */
  private onRequestLeave(user: UserDocument): void {
    this.utils.ejectUser(user);
  }

  /**
   * Called when a user requests for a room to be made.
   * 
   * @param user The user that made the request.
   * @param data Information about the requested room.
   */
  private onRoomAdd(user: User, data: any) {
    const name: string = data.name.toString().trim();
    const description: string | undefined = data.description ? data.description.toString().trim() : undefined;
    const password: string | undefined = data.password ? data.password.toString() : undefined;

    // Do not allow empty room names.
    if (name.length === 0) {
      return;
    }

    // Try to create a new room.
    Rooms.create({
      name: name,
      description: description,
      password: password,
      owner: user
    }, (err, room) => {
      // If there was an error, report it.
      if (err) {
        user.emit('roomAdd', {
          room: null,
          message: err
        });

        return;
      }

      // Otherwise, replicate the room status so everyone can see the room.
      this.server.users.forEach(user => this.manager.replicate(room, user));

      // Notify the user that the room has been created.
      user.emit('roomAdd', {
        room: room
      });
    });
  }
}