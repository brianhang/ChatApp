/**
 * The User class is a user in the chatroom.
 */
export class User {
  public nickname: string;

  // Whether or not this user is typing.
  public isTyping: boolean;

  constructor(nickname: string) {
    this.nickname = nickname;
  }
}
