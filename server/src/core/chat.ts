import { Server } from './server';
import { Server as HttpServer } from 'http';
import { MessageService } from '../messaging/service';
import { RoomService } from '../room/service';
import { UserService } from '../user/service';

import connectToDb from './database';

/**
 * The ChatServer class is responsible for handling data for a chat room.
 */
export class ChatServer {
  // The socket server to sent data from.
  private server: Server;

  // Services for handling user events.
  private messageService: MessageService;
  private roomService: RoomService;
  private userService: UserService;

  /**
   * Creates a server socket to receive messages from the users in the
   * chat server.
   * 
   * @param server The server for handling connections.
   */
  constructor(io: SocketIO.Server) {
    // Initialize server components.
    this.server = new Server(io);
  }

  /**
   * Sets up the database connection for the chat server.
   * 
   * @return A promise for when the chat server has been set up.
   */
  public setup(): Promise<void> {
    return connectToDb('mongodb://localhost/chatDb');
  }

  /**
   * Start handling connections to the chat server.
   */
  public start(): void {
    this.messageService = new MessageService(this.server);
    this.roomService = new RoomService(this.server, this.messageService);
    this.userService = new UserService(this.server);
  }
}