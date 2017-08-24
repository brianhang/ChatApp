import { UserDocument } from '../../core/interfaces/user-document';
import { Users } from '../../core/models/users';
import { MessageDocument } from '../../messaging/interfaces/message-document';
import { Messages } from '../../messaging/models/messages';

export class Room {
  public name: string;
  public description: string;
  public password: string;
  public owner: UserDocument;
  public bans: string[];

  public getUsers(): Promise<UserDocument[]> {
    const users: UserDocument[] = [];

    return new Promise((resolve, reject) => {
      Users.find({ room: this })
        .lean()
        .cursor()
        .eachAsync((user: UserDocument) => users.push(user))
        .then(() => resolve(users));
    });
  }

  public getMessages(): Promise<MessageDocument[]> {
    const messages: MessageDocument[] = [];

    return new Promise((resolve, reject) => {
      Messages.find({ room: this })
        .cursor()
        .eachAsync((message: MessageDocument) => messages.push(message))
        .then(() => resolve(messages));
    });
  }
}