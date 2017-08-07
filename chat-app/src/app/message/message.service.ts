import { Injectable } from '@angular/core';
import { ChatService } from '../chat/chat.service';
import { Message } from './models/message';
import { RoomService } from 'app/room/room.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MessageService {
  private _messageAdded: Subject<Message>;
  private _messages: Message[];

  constructor(private chatService: ChatService, private roomService: RoomService) {
    this._messages = [];
    this._messageAdded = new Subject<Message>();

    this.chatService.on('message', data => this.onMessageReceived(data));
  }

  /**
   * Called when a message has been received by the server.
   */
  private onMessageReceived(data: any) {
    console.log(data)
    // Create a new message instance from the given data.
    const message = new Message();
    message.nickname = data.nickname;
    message.content = data.content;
    message.room = this.roomService.getRoomById(data.room);

    this._messages.push(message);
    this._messageAdded.next(message);
  }

  /**
   * Sends a message to the current chat room.
   *
   * @param content The contents of the message.
   */
  public send(content: string): void {
    this.chatService.emit('message', {
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