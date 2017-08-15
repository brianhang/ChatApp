import { UserDocument } from '../../core/interfaces/user-document';
import { Users } from '../../core/models/users';

export class Room {
  public name: string;
  public description: string;
  public password: string;
  public owner: UserDocument;

  public getUsers(): Promise<UserDocument[]> {
    const users: UserDocument[] = [];

    return new Promise((resolve, reject) => {
      Users.find({ room: this })
        .cursor()
        .eachAsync((user: UserDocument) => users.push(user))
        .then(() => resolve(users));
    });
  }
}