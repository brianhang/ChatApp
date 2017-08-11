import { Room } from './models/room';
import { User } from '../core/models/user';
import { Users } from '../core/models/users';
import { UserDocument } from "../core/interfaces/user-document";

export class RoomUtils {
  public getUsers(room: Room): Promise<UserDocument[]> {
    return new Promise((resolve, reject) => {
      const users: UserDocument[] = [];

      Users.find({ room: room }).cursor()
        .eachAsync((user: UserDocument) => users.push(user))
        .then(() => resolve(users));
    });
  }
}