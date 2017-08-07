import { User } from '../core/user';
import { Server } from '../core/server';
import { Message } from './message';
import { MessageFilter } from './filters/message-filter';
import { RoomFilter } from './filters/room-filter';

const MAX_LENGTH = 4096;

/**
 * The MessageService class handles messaging in the chat application.
 */
export class MessageService {
  private messages: Message[];

  /**
   * Constructor that takes in a socket to handle messaging events.
   * 
   * @param server The server for the chat room.
   */
  constructor(private server: Server) {
    this.messages = [];
    this.server.on('msg', (sender: User, data: any) => this.onMessageReceived(sender, data));

    this.server.postUserJoined.subscribe(user => {
      setTimeout(() => {
        let i = 0;

        this.messages.forEach(message => {
          setTimeout(() => {
            user.emit('msg', this.getMessagePayload(message));
          }, i * 50);
          i++;
        });
      }, 1000);
    });
  }

  /**
   * Creates the data that the client expects in order to receive a particular
   * message.
   * 
   * @param message The message that will be sent.
   * @return Data in order to send the message to clients.
   */
  private getMessagePayload(message: Message): any {
    return {
      nickname: message.nickname,
      room: message.room.id,
      content: message.content,
      time: message.time
    };
  }

  /**
   * Called when a user sends a message. This handler is responsible for
   * sending the message to whoever should receive it.
   * 
   * @param sender The user that sent the message.
   * @param data The data for the message received.
   */
  private onMessageReceived(sender: User, data: any): void {
    if (!sender.room) {
      return;
    }

    const message = new Message();
    message.nickname = sender.nickname;
    message.room = sender.room;
    message.content = data.content.substring(0, MAX_LENGTH);
    message.time = Date.now();

    this.messages.push(message);
    this.server.emit('msg', this.getMessagePayload(message));
  }
}