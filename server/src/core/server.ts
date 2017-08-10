import * as socket from 'socket.io';
import { Subject, Observable } from 'rxjs';
import { User } from './models/user';

/**
 * The Server class is responsible for handling messages between the chat server
 * and its clients.
 */
export class Server {
  // Subjects for when users join and left.
  //private _userJoined: Subject<User>;
  //private _userLeft: Subject<User>;
  //private _postUserJoined: Subject<User>;

  // The users who are connected to this server.
  private _users: Map<string, User>;

  private _userConnected: Subject<User>;
  private _userJoined: Subject<User>;

  // The event handlers for socket messages.
  private handlers: Map<string, Function>;

  /**
   * Contructor that sets up the server socket.
   * 
   * @param io The socket for the server.
   */
  constructor(private io: SocketIO.Server) {
    // Set up user session for the socket for user authentication.
    this.handlers = new Map<string, any>();

    // Set up the list of connected users.
    this._users = new Map<string, User>();

    // Set up subjects for user events.
    this._userConnected = new Subject<User>();
    this._userJoined = new Subject<User>();

    // Set up what to do when a user joins.
    this.io.on('connection', socket => this.onUserConnected(socket));
  }

  /**
   * Called when a socket connects to this server. This will handle setting up
   * a User object for the socket.
   * 
   * @param socket The socket that connected.
   */
  private onUserConnected(socket: SocketIO.Socket): void {
    const user = socket.request.user;

    if (!user) {
      return;
    }

    console.log(socket.request.user.nickname + ' has connected.');

    this.handlers.forEach((listener: any, event: string) => {
      socket.on(event, (data: any) => listener(socket, data));
    });

    this._users.set(socket.id, user);
    user.socket = socket;

    this._userConnected.next(user);

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

    this._userJoined.next(user);
    
    socket.emit('joined', {
      id: user.id,
      nickname: user.nickname
    });

    socket.on('disconnect', () => this.onUserDisconnected(user));

    this._postUserJoined.next(user);
    */

    this._userJoined.next(socket.request.user);
  }

  /**
   * Returns an observable for when a user has fully joined the chat room.
   * 
   * @return An observable stream of users.
   */
  public get userJoined(): Observable<User> {
    return this._userJoined.asObservable();
  }

  /**
   * Called after the user has fully joined the chat room.
   * 
   * @return An observable stream of users.
   */
  public get userConnected(): Observable<User> {
    return this._userConnected.asObservable();
  }

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
  public get users(): User[] {
    return Array.from(this._users.values());
  }
  
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
  public on(event: string, listener: Function): void {
    this.handlers.set(event, (socket: SocketIO.Socket, data: any) => {
      // Get the user from the socket.
      const user: User = socket.request.user;

      if (user) {
        user.socket = socket;
        listener(user, data);
      }
    });
  }
}