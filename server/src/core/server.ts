import { Server as HttpServer } from 'http';
import * as socket from 'socket.io';
import { User } from './user';

/**
 * The Server class is responsible for handling messages between the chat server
 * and its clients.
 */
export class Server {
  // The server's socket for communication.
  private io: SocketIO.Server;

  // The users who are connected to this server.
  private users: Map<string, User>;

  /**
   * Contructor that sets up the server socket.
   * 
   * @param httpServer The HTTP server to bind to.
   */
  constructor(httpServer: HttpServer) {
    this.io = socket(httpServer);
    this.users = new Map<string, User>();
  }

  /**
   * Called when a socket connects to this server. This will handle setting up
   * a User object for the socket.
   * 
   * @param socket The socket that connected.
   */
  private onUserConnected(socket: SocketIO.Socket): void {
    // Do not allow duplicate connections.
    if (this.users.get(socket.id)) {
      return;
    }

    this.users.set(socket.id, new User(socket));
    socket.emit('connected');
  }

  /**
   * Called when a socket disconnects from this server. This will handle
   * cleaning up the corresponding User object.
   * 
   * @param socket The socket that disconnected.
   */
  private onUserDisconnected(socket: SocketIO.Socket): void {

  }

  /**
   * Returns all of the connected users.
   * 
   * @return A list of users who are connected.
   */
  public getUsers(): User[] {
    return Array.from(this.users.values());
  }

  /**
   * Sends an event to all users connected.
   * 
   * @param message 
   * @param data 
   */
  public send(event: string, data: any): void {
    this.io.emit(event, data);
  }

  /**
   * Adaptor for listening to socket events so the user is associated with
   * event data rather than an actual socket.
   * 
   * @param event The name of the event to listen for.
   * @param listener What to do when the message is received.
   */
  public on(event: string, listener: Function): void {
    this.io.on(event, (socket: SocketIO.Socket, data: any) => {
      // Get the user from the socket.
      const user = this.users.get(socket.id);

      if (user) {
        listener(user, data);
      }
    });
  }
}