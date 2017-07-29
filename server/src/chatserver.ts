import { Server } from 'http';
import * as socket from 'socket.io';
import { User } from './user';
import { Message } from './message';

/**
 * The ChatServer class is responsible for handling data for a chat room.
 */
export class ChatServer {
  // The socket server to sent data from.
  private io: SocketIO.Server;

  // A list of messages that have been posted.
  private messages: Message[];

  // A list of connected users.
  private users: Map<string, User>;

  /**
   * Starts the chat server.
   * 
   * @param server The server for handling connections.
   */
  constructor(server: Server) {
    // Initialize server components.
    this.io = socket(server);
    this.messages = [];
    this.users = new Map<string, User>();
  }

  /**
   * Start handling connections to the chat server.
   */
  public start(): void {
    this.io.on('connection', (socket: SocketIO.Socket) => this.handleConnection(socket));
  }

  /**
   * Sets up handlers for messages that may be sent to the server from a user.
   * 
   * @param socket A socket that has connected to the server.
   */
  private handleConnection(socket: SocketIO.Socket): void {
    socket.on('join', (nickname: string) => this.handleJoin(socket, nickname));
    socket.on('message', (content: string) => this.handleMessage(socket, content));
    socket.on('typing', (isTyping) => this.handleTyping(socket, isTyping));
    socket.on('disconnect', () => this.handleLeave(socket));
  }

  /**
   * Replicates the current chat when a user joins and create a new user object
   * for the user so messages can be sent.
   * 
   * @param socket The socket that sent this message.
   * @param nickname The desired nickname for the user.
   */
  private handleJoin(socket: SocketIO.Socket, nickname: string): void {
    // Do not allow duplicate connections.
    if (this.users.get(socket.id)) {
      return;
    }

    // Replicate all of the current users.
    const user = new User(nickname, socket);
    this.users.set(socket.id, user);

    this.users.forEach((other: User) => {
      other.replicate(user);
    });

    // Replicate all of the messages.
    this.messages.forEach((message: Message): void => {
      socket.emit('message', {
        nickname: message.nickname,
        content: message.content
      });
    });

    // Connect the user to the chatroom so the person can use the chat.
    user.connect();
  }

  /**
   * Broadcasts and stores messages sent by users.
   * 
   * @param socket  The socket that sent this message.
   * @param content The body of the desired message.
   */
  private handleMessage(socket: SocketIO.Socket, content: string): void {
    // Make sure this message came from an existing user.
    const user = this.users.get(socket.id);

    if (user == null) {
      return;
    }

    // Store the message.
    const message = new Message();
    message.nickname = user.getNickname();
    message.content = content;

    this.messages.push(message);

    // Send the message to everyone.
    this.io.sockets.emit('message', {
      nickname: message.nickname,
      content: message.content
    });
  }

  /**
   * Handles the replication of whether or not a user is typing.
   * 
   * @param socket The socket that sent this message.
   * @param isTyping Whether or not the user is now typing.
   */
  private handleTyping(socket: SocketIO.Socket, isTyping: boolean): void {
    const user = this.users.get(socket.id);

    if (user && user.isTyping != isTyping) {
      console.log(user.getNickname() + ' is ' + (isTyping ? '' : 'not ') + 'typing');
      user.setTyping(isTyping);
    }
  }

  /**
   * Cleans up resources for the user that just disconnected.
   * 
   * @param socket The socket that just disconnected from the server.
   */
  private handleLeave(socket: SocketIO.Socket): void {
    socket.broadcast.emit('userLeave', socket.id);
    this.users.delete(socket.id);
  }
}