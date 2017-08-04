import { Room } from '../../room/models/room';

/**
 * The User class is a user in the chatroom.
 */
export class User {
  // The name of the user.
  public nickname: string;

  // Whether or not this user is typing.
  public isTyping: boolean;

  // The room that the user is in.
  public room: Room | undefined;

  constructor(private _id: string, nickname: string) {
    this.nickname = nickname;
  }

  /**
   * Returns the ID of this user.
   *
   * @return A unique string identifier for this user.
   */
  public get id(): string {
    return this._id;
  }
}
