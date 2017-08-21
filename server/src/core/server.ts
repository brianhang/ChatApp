import * as socket from 'socket.io';
import { Subject, Observable } from 'rxjs';
import { User } from './models/user';
import { UserDocument } from "./interfaces/user-document";

export const UserSocketMap = new Map<string, SocketIO.Socket>();

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
  private _users: Map<string, UserDocument>;
  private _userList: UserDocument[];

  private _userConnected: Subject<UserDocument>;
  private _userJoined: Subject<UserDocument>;
  private _userLeft: Subject<UserDocument>;

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
    this._users = new Map<string, UserDocument>();
    this._userList = [];

    // Set up subjects for user events.
    this._userConnected = new Subject<UserDocument>();
    this._userJoined = new Subject<UserDocument>();
    this._userLeft = new Subject<UserDocument>();

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
    const user: UserDocument | undefined = socket.request.user;

    if (!user) {
      return;
    }

    const userId = user._id.toHexString();
    const oldUser = this._users.get(userId);

    if (oldUser) {
      oldUser.socket.disconnect(true);
    }

    socket.on('disconnect', () => this.onUserDisconnected(user));
    (<any>socket).userId = user._id.toHexString();

    this.handlers.forEach((listener: any, event: string) => {
      socket.on(event, (data: any) => listener(socket, data));
    });

    this._users.set(userId, user);
    this._userList.push(user);

    user.socket = socket;

    UserSocketMap.set(userId, socket);

    this._userConnected.next(user);

    this._users.forEach(other => {
      user.emit('userData', other);
      other.emit('userData', user);
    });

    socket.emit('joined', user);

    this._userJoined.next(user);
  }

  /**
   * Returns an observable for when a user has fully joined the chat server.
   * 
   * @return An observable stream of users.
   */
  public get userJoined(): Observable<UserDocument> {
    return this._userJoined.asObservable();
  }

  /**
   * Called after the user has fully joined the chat server.
   * 
   * @return An observable stream of users.
   */
  public get userConnected(): Observable<UserDocument> {
    return this._userConnected.asObservable();
  }

  /**
   * Called after a user has left the chat server.
   * 
   * @return An observable stream of users.
   */
  public get userLeft(): Observable<UserDocument> {
    return this._userLeft.asObservable();
  }

  /**
   * Called when a socket disconnects from this server. This will handle
   * cleaning up the corresponding User object.
   * 
   * @param socket The socket that disconnected.
   */
  private onUserDisconnected(user: UserDocument): void {
    this._userLeft.next(user);
    this.emit('userLeft', user._id);
    this._userList = this._userList.filter(x => !user.equals(x));
  }

  /**
   * Returns all of the connected users.
   * 
   * @return A list of users who are connected.
   */
  public get users(): UserDocument[] {
    return this._userList;
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
      const user: UserDocument = socket.request.user;

      if (user) {
        user.socket = socket;
        listener(user, data);
      }
    });
  }
}