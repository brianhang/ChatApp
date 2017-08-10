export class User {
  public nickname: string;
  public socket: SocketIO.Socket;

  /**
   * Emits an event to the socket for this user.
   * 
   * @param event The name of the event to emit.
   * @param data Data about the event.
   */
  public emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}