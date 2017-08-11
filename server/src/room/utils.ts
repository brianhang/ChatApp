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
   * Retrieves a list of users in a particular room.
   * 
   * @param room The room to get users from.
   * @return A promise containing the users in the room.
   */
  public getUsers(room: Room): Promise<UserDocument[]> {
    return new Promise((resolve, reject) => {
      const users: UserDocument[] = [];

      Users.find({ room: room }).cursor()
        .eachAsync((user: UserDocument) => users.push(user))
        .then(() => resolve(users));
    });
  }

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