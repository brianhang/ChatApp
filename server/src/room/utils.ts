import { Room } from './models/room';
import { User } from '../core/models/user';
import { Users } from '../core/models/users';
import { UserDocument } from "../core/interfaces/user-document";
import { Server } from '../core/server';

export class RoomUtils {
  /**
   * Constructor that sets up the server to send events from.
   * 
   * @param server The server to send events from.
   */
  constructor(private server: Server) { }

  /**
   * Removes a user from the room they are in.
   * 
   * @param server The server to notify clients with.
   * @param user The user to eject.
   */
  public ejectUser(user: UserDocument): void {
    if (user.room) {
      this.server.emit('roomLeave', {
        userId: user._id
      });

      user.room = undefined;
      user.save();
    }
  }
}