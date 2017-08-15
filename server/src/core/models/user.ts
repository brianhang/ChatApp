import { RoomDocument } from '../../room/interfaces/room-document';

export class User {
  public nickname: string;
  public room?: RoomDocument;
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

  /**
   * Sends a notification to the user to display various information.
   * 
   * @param title The title of the notification.
   * @param body The body of the notification.
   * @param type The type of notification.
   */
  public notify(title: string, body?: string, type?: string): void {
    this.socket.emit('notice', {
      title: title,
      body: body,
      type: type
    });
  }
}