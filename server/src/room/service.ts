import { Server } from '../core/server';
import { User } from '../core/models/user';
import { Rooms } from './models/rooms';
import { RoomManager } from './manager';
import { RoomDocument } from './interfaces/room-document';
import { RoomUtils } from './utils';
import { UserDocument } from '../core/interfaces/user-document';
import { RoomEditorService } from './editor';
import { MessageService } from '../messaging/service';
import { RoomOwnerService } from './owner';

export class RoomService {
  private editorService: RoomEditorService;

  // Manager class for the state of rooms.
  private manager: RoomManager;

  // Service for handling room owner actions.
  private ownerService: RoomOwnerService;

  private utils: RoomUtils;

  constructor(private server: Server, private messageService: MessageService) {
    this.utils = new RoomUtils(this.server);
    this.ownerService = new RoomOwnerService(this.server, this, this.utils);

    this.manager = new RoomManager(server, this.utils);
    this.editorService = new RoomEditorService(this.server, this, this.manager);

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
    Rooms.find({})
      .cursor()
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

      const authError: string = this.checkJoinAuthorization(user, room, data);

      if (authError !== '') {
        user.notify('Oh no!', authError, 'error');

        return;
      }

      const oldRoom = user.room;

      this.server.emit('roomJoin', {
        roomId: room._id,
        userId: user._id
      });

      user.room = room;
      user.save();

      this.onUserJoinedRoom(user, room, oldRoom);

      console.log(`${user.nickname} has joined ${room.name}`);
    });
  }

  /**
   * Called when a user joins a particular room.
   * 
   * @param user The user that has joined a room.
   * @param room The room that the user joined.
   * @param oldRoom The last room the user was in.
   */
  private onUserJoinedRoom(
    user: UserDocument,
    room: RoomDocument,
    oldRoom: RoomDocument | undefined
  ): void {
    this.messageService.replicate(user, room);

    if (oldRoom && oldRoom._id) {
      (<any>user).lastRoomJoin.set(oldRoom._id.toHexString(), new Date());
    }
  }

  /**
   * Called when the user wants to join and permission to needs to be checked.
   * If the user attempts to join the room but is not allowed, then a
   * notification will be sent. If the user is authorized, the error message
   * returned will be empty.
   * 
   * @param user The user that is trying to join a room.
   * @param room The room that the user is trying to join.
   * @param data Information about the join request.
   * @return An error message if an error occured.
   */
  private checkJoinAuthorization(
    user: UserDocument,
    room: RoomDocument,
    data: any
  ): string {
    // Always allow the room owner in.
    if (user.equals(room.owner)) {
      return '';
    }

    // Room password check.
    if (room.password && room.password.length > 0) {
      const password = data.password;

      if (password !== room.password) {
        return 'The password entered is not correct';
      }
    }

    // Make sure the user is not banned from the room.
    if (room.bans.find(ban => ban === (<any>user).username)) {
      return 'You are banned from this room.';
    }

    return '';
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
  private onRoomAdd(user: UserDocument, data: any) {
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
          message: err,
          owner: user._id
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