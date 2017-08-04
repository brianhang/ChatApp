import { Server } from './server';
import { Server as HttpServer } from 'http';
import { MessageService } from '../messaging/service';
import { RoomService } from '../room/service';
import { VideoService } from '../video/service';
import { VoiceService } from '../voice/service';

/**
 * The ChatServer class is responsible for handling data for a chat room.
 */
export class ChatServer {
  // The socket server to sent data from.
  private server: Server;

  // Services for handling user events.
  private messageService: MessageService;
  private roomService: RoomService;
  private videoService: VideoService;
  private voiceService: VoiceService;

  /**
   * Creates a server socket to receive messages from the users in the
   * chat server.
   * 
   * @param server The server for handling connections.
   */
  constructor(httpServer: HttpServer) {
    // Initialize server components.
    this.server = new Server(httpServer);
  }

  /**
   * Start handling connections to the chat server.
   */
  public start(): void {
    this.messageService = new MessageService(this.server);
    this.roomService = new RoomService(this.server);
    this.videoService = new VideoService(this.server);
    this.voiceService = new VoiceService(this.server);
  }
}