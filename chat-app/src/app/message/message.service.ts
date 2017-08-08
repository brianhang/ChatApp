import { Injectable } from '@angular/core';
import { ChatService } from '../chat/chat.service';
import { Message } from './models/message';
import { RoomService } from 'app/room/room.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/**
 * The MessageService handles sending and receiving of messages to and from the
 * chat server.
 */
@Injectable()
export class MessageService {
  // Subject for when a message was added to the chat server.
  private _messageAdded: Subject<Message>;

  // A list of messages that have been sent from the chat server.
  private _messages: Message[];

  /**
   * Constructor that sets up listnening for messages.
   *
   * @param chatService Service that allows for sending/receiving of data.
   * @param roomService Service for getting room data.
   */
  constructor(private chatService: ChatService, private roomService: RoomService) {
    this._messages = [];
    this._messageAdded = new Subject<Message>();

    this.chatService.on('msg', data => this.onMessageReceived(data));
  }

  /**
   * Called when a message has been received by the server.
   */
  private onMessageReceived(data: any) {
    // Create a new message instance from the given data.
    const message = new Message();
    message.nickname = data.nickname;
    message.content = data.content;
    message.room = this.roomService.getRoomById(data.room);
    message.time = data.time;

    this._messages.push(message);
    this._messageAdded.next(message);
  }

  /**
   * Sends a message to the current chat room.
   *
   * @param content The contents of the message.
   */
  public send(content: string): void {
    this.chatService.emit('msg', {
      content: content
    });
  }

  /**
   * Returns all the messages that have been received.
   *
   * @return A list of messages in the chat room.
   */
  public get messages(): Message[] {
    return this._messages;
  }

  /**
   * Returns a stream of messages that were added to the chat.
   *
   * @return An observable stream of messages.
   */
  public get messageAdded(): Observable<Message> {
    return this._messageAdded.asObservable();
  }
}
