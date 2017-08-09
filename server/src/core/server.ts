import { Server as HttpServer } from 'http';
import * as socket from 'socket.io';
import { Subject, Observable } from 'rxjs';

/**
 * The Server class is responsible for handling messages between the chat server
 * and its clients.
 */
export class Server {
  // The server's socket for communication.
  private io: SocketIO.Server;

  // Subjects for when users join and left.
  //private _userJoined: Subject<User>;
  //private _userLeft: Subject<User>;
  //private _postUserJoined: Subject<User>;

  // The users who are connected to this server.
  //private users: Map<string, User>;

  // The event handlers for socket messages.
  private handlers: Map<string, Function>;

  /**
   * Contructor that sets up the server socket.
   * 
   * @param httpServer The HTTP server to bind to.
   */
  constructor(httpServer: HttpServer) {
    this.io = socket(httpServer);
    this.handlers = new Map<string, any>();

    /*
    this.users = new Map<string, User>();

    this._userJoined = new Subject<User>();
    this._postUserJoined = new Subject<User>();
    this._userLeft = new Subject<User>();
    */

    this.io.on('connection', socket => this.onUserConnected(socket));
  }

  /**
   * Called when a socket connects to this server. This will handle setting up
   * a User object for the socket.
   * 
   * @param socket The socket that connected.
   */
  private onUserConnected(socket: SocketIO.Socket): void {
    // Do not allow duplicate connections.
    /*
    if (this.users.get(socket.id)) {
      return;
    }
    */
    this.handlers.forEach((listener: any, event: string) => {
      socket.on(event, (data: any) => listener(socket, data));
    });
    /*
    const user = new User(socket);
    user.nickname = socket.id;

    this.users.forEach(other => {
      user.emit('userData', {
        id: other.id,
        nickname: other.nickname
      });

      other.emit('userData', {
        id: user.id,
        nickname: user.nickname
      });
    });

    this.users.set(socket.id, user);
    this._userJoined.next(user);
    
    socket.emit('joined', {
      id: user.id,
      nickname: user.nickname
    });

    socket.on('disconnect', () => this.onUserDisconnected(user));

    this._postUserJoined.next(user);
    */
  }

  /**
   * Returns an observable for when a user has fully joined the chat room.
   * 
   * @return An observable stream of users.
   */
  /*
  public get userJoined(): Observable<User> {
    return this._userJoined.asObservable();
  }
  */
  /**
   * Called after the user has fully joined the chat room.
   * 
   * @return An observable stream of users.
   */
  /*
  public get postUserJoined(): Observable<User> {
    return this._postUserJoined.asObservable();
  }
  */
  /**
   * Returns an observable for when a user has left the chat room.
   * 
   * @return An observable stream of users.
   */
  /*
  public get userLeft(): Observable<User> {
    return this._userLeft.asObservable();
  }
  */

  /**
   * Called when a socket disconnects from this server. This will handle
   * cleaning up the corresponding User object.
   * 
   * @param socket The socket that disconnected.
   */
  /*
  private onUserDisconnected(user: User): void {
    this._userLeft.next(user);
    this.users.delete(user.id);

    this.emit('userLeft', user.id);
  }
  */

  /**
   * Returns all of the connected users.
   * 
   * @return A list of users who are connected.
   */
  /*
  public getUsers(): User[] {
    return Array.from(this.users.values());
  }
  */
  
  /**
   * Emits an event to all users connected.
   * 
   * @param message 
   * @param data 
   */
  public emit(event: string, data: any): void {
    this.io.sockets.emit(event, data);
  }

  /**
   * Adaptor for listening to socket events so the user is associated with
   * event data rather than an actual socket.
   * 
   * @param event The name of the event to listen for.
   * @param listener What to do when the message is received.
   */
  /*
  public on(event: string, listener: Function): void {
    this.handlers.set(event, (socket: SocketIO.Socket, data: any) => {
      // Get the user from the socket.
      const user: User | undefined = this.users.get(socket.id);

      if (user) {
        listener(user, data);
      }
    });
  }
  */
}