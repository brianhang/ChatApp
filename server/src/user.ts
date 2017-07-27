/**
 * The User class is a user in the chatroom.
 */
export class User {
  private userId: string;

  /**
   * The constructor that sets up the initial data for the user.
   * 
   * @param nickname The name of the user.
   * @param socket The socket for sending/receiving data from the user.
   */
  constructor(private nickname: string, private socket: SocketIO.Socket) {
    this.userId = socket.id;
  }

  /**
   * getNickname
   * 
   * @return The nickname for this user.
   */
  public getNickname() {
    return this.nickname;
  }

  /**
   * Updates the nickname for this user and broadcasts the nickname change to
   * other connected users.
   * 
   * @param nickname The new nickname for the user.
   */
  public setNickname(nickname: string) {
    this.nickname = nickname;
    this.socket.broadcast.emit('nickname', {
      userId: this.userId,
      nickname: nickname
    });
  }

  /**
   * Informs the chatroom that this user has joined.
   */
  public connect() {
    const data = {
      userId: this.userId,
      nickname: this.nickname,
      isLocalUser: false
    };

    this.socket.broadcast.emit('userJoin', data);

    data.isLocalUser = true;
    this.socket.emit('userJoin', data);
  }

  /**
   * Returns the ID of this user.
   */
  public getUserId() {
    return this.userId;
  }

  /**
   * Returns the socket for another user to send data to.
   */
  public getSocket() {
    return this.socket;
  }

  /**
   * Sends data about this user to the given recipient.
   */
  public replicate(recipient: User) {
    recipient.getSocket().emit('userJoin', {
      userId: this.userId,
      nickname: this.nickname
    });
  }
}
