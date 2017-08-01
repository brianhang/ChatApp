import { User } from '../core/user';
import { Server } from '../core/server';
import { Message } from './message';
import { MessageFilter } from './filters/message-filter';
import { RoomFilter } from './filters/room-filter';

/**
 * The MessageService class handles messaging in the chat application.
 */
export class MessageService {
  /**
   * Constructor that takes in a socket to handle messaging events.
   * 
   * @param io The server socket to receive messages from.
   */
  constructor(private server: Server) {
    this.server.on('message', this.onMessageReceived);
  }

  /**
   * Sends a message to the chat server from the specified user.
   * 
   * @param sender The user that is sending the message.
   * @param filter The filter to determine who receives the message.
   * @param content What the user said.
   */
  public send(sender: User, filter: MessageFilter, content: Message): void {
    // Send the message only to people who pass the filter.
    for (let recipient of this.server.getUsers()) {
      if (filter.check(sender, recipient)) {
        recipient.send('message', {
          nickname: sender.nickname,
          content: content
        });
      }
    }
  }

  /**
   * Called when a user sends a message. This handler is responsible for
   * sending the message to whoever should receive it.
   * 
   * @param sender The user that sent the message.
   * @param data The data for the message received.
   */
  public onMessageReceived(sender: User, data: any): void {
    const message = new Message();
    message.content = data;

    this.send(sender, new RoomFilter(), message);
  }
}