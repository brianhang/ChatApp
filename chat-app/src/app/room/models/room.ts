import { User } from '../../chat/models/user';

export class Room {
  private _users: User[];

  constructor(private _id: string, public name: string) {
    this._users = [];
  }

  public get id() {
    return this._id;
  }

  public addUser(user: User): void {
    this._users.push(user);
    user.room = this;
  }

  public removeUser(user: User): void {
    this._users = this._users.filter(other => other.id !== user.id);
    user.room = undefined;
  }

  public get users() {
    return this._users;
  }
}
