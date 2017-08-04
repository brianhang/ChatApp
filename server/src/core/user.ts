import { Room } from '../room/room';

/** 
 * The User class is a user in the chatroom.
 */
export class User {
  // A unique identifier for the user.
  private userId: string;

  // The name for the user.
  private _nickname: string;

  // The room that the user is in.
  public room: Room | undefined;

  /**
   * Constructor for the User which takes in the socket that belongs to the
   * user.
   * 
   * @param socket The socket that corresponds to this user.
   */
  constructor(private socket: SocketIO.Socket) { }

  /**
   * Emits an event to this user.
   * 
   * @param event The name of the event to send.
   * @param data The data to send.
   */
  public emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  /**
   * Sets the nickname for this user and informs the server about it.
   * 
   * @param nickname The new nickname for the user.
   */
  public set nickname(nickname: string) {
    this._nickname = nickname;
    this.socket.broadcast.emit('nickname', {
      userId: this.socket.id,
      nickname: nickname
    });
  }

  /**
   * Returns the nickname for this user.
   * 
   * @return A string containing the user's nickname.
   */
  public get nickname(): string {
    return this._nickname;
  }
  
  /**
   * Returns a unique identifier for the user.
   * 
   * @return A string identifier for the user.
   */
  public get id() {
    return this.socket.id;
  }
}
