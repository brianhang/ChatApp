import { Injectable } from '@angular/core';
import { ChatService } from '../chat/chat.service';
import { Message, MessageDto } from './models/message';
import { RoomService } from '../room/room.service';
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

  // Subject for when a message has been deleted from the server.
  private _messageDeleted: Subject<string>;

  // Subject for when a message has been modified on the server.
  private _messageEdited: Subject<Message>;

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
    this._messageDeleted = new Subject<string>();
    this._messageEdited = new Subject<Message>();

    this.chatService.on('msg', data => this.onMessageReceived(data, false));
    this.chatService.on('msgRev', data => this.onMessageReceived(data, true));
    this.chatService.on('msgEdit', data => this.onMessageEdited(data));
    this.chatService.on('msgDelete', data => this.onMessageDeleted(data));
  }

  /**
   * Called when a message has been received by the server.
   */
  private onMessageReceived(data: MessageDto, reverse: boolean) {
    const message = new Message();
    message._id = data._id;
    message.user = data.user;
    message.nickname = data.nickname;
    message.icon = data.icon;
    message.content = data.content;
    message.room = data.room;
    message.time = new Date(data.time);

    if (reverse) {
      this._messages.unshift(message);
    } else {
      this._messages.push(message);
    }

    this._messageAdded.next(message);
  }

  /**
   * Called when a message has been modified on the chat server. This will
   * replicate the modification.
   *
   * @param data Information about the edit event.
   */
  private onMessageEdited(data: any): void {
    const messageId: string = data.messageId;
    const content: string = data.content;

    this._messages.forEach(message => {
      if (message._id === messageId) {
        message.content = content;

        this._messageEdited.next(message);
      }
    });
  }

  /**
   * Called when a message has been deleted from the chat server.
   *
   * @param messageId The ID of the deleted message.
   */
  private onMessageDeleted(messageId: string): void {
    this._messages = this._messages.filter(message => message._id !== messageId);
    this._messageDeleted.next(messageId);
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
   * Requests for more messages before the given date to be loaded for the
   * current room.
   *
   * @param date The date to look back from.
   * @param roomId The ID for which room to get messages for.
   * @return A promise after the older messages have been loaded.
   */
  public requestOlderMessages(date: Date): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.chatService.on('msgRequestOlderResult', () => resolve());
      this.chatService.emit('msgRequestOlder', date.toUTCString());
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

  /**
   * Returns a stream of messages that were deleted from the chat.
   *
   * @return An observable stream of messages.
   */
  public get messageDeleted(): Observable<string> {
    return this._messageDeleted.asObservable();
  }

  /**
   * Returns a stream of messages that were modified.
   *
   * @return An observable stream of messages.
   */
  public get messageEdited(): Observable<Message> {
    return this._messageEdited.asObservable();
  }

  /**
   * Requests to have a message edited.
   *
   * @param messageId The ID of the desired message to edit.
   * @param content What the new contents of the message should be.
   * @return A promise for after the message has been edited.
   */
  public edit(messageId: string, content: string): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      this.chatService.on('msgEditResult', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    this.chatService.emit('msgEdit', {
      messageId: messageId,
      content: content
    });

    return promise;
  }

  /**
   * Requests to have a message deleted.
   *
   * @param messageId The ID of the desired message.
   */
  public delete(messageId: string): void {
    this.chatService.emit('msgDelete', messageId);
  }
}
