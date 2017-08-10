import { Server } from '../core/server';
import { User } from '../core/models/user';
import { Rooms } from './models/rooms';
import { RoomManager } from './manager';
import { RoomDocument } from './interfaces/room-document';

export class RoomService {
  // Manager class for the state of rooms.
  private manager: RoomManager;

  constructor(private server: Server) {
    this.manager = new RoomManager(server);

    this.server.userJoined.subscribe(user => this.onUserJoined(user));

    this.server.on('roomAdd', (user: User, data: any) => this.onRoomAdd(user, data));
  }

  /**
   * Called when a user joins the server. This will send all the rooms to
   * the client.
   * 
   * @param user The user that just joined.
   */
  private onUserJoined(user: User): void {
    // Load all rooms for the chat server and store it for later use.
    const stream = Rooms.find({}).stream();

    stream.on('data', (room: RoomDocument) => this.manager.replicate(room, user));
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
      password: password
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