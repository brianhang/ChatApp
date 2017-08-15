import { MessageDocument } from './interfaces/message-document';
import { MessageRequest } from './interfaces/message-request';
import { Server } from '../core/server';
import { UserDocument } from '../core/interfaces/user-document';
import { Messages } from "./models/messages";

const HISTORY_LENGTH = 250;

export class MessageService {

  constructor(private server: Server) {
    this.server.on('msg', (user: any, data: any) => this.onMessageSent(user, data));
    this.server.on('typing', (user: any, data: any) => this.onUserTypingStateChanged(user, data));
    this.server.on('msgEdit', (user: any, data: any) => this.onMessageEdit(user, data));
    this.server.on('msgDelete', (user: any, data: any) => this.onMessageDelete(user, data));

    this.server.userJoined.subscribe(user => this.onUserJoin(user));
  }

  private onUserJoin(user: UserDocument): void {
    Messages.find({})
      .sort('time')
      .limit(HISTORY_LENGTH)
      .populate('room._id')
      .cursor()
      .eachAsync((message: MessageDocument) => {
        this.sendToUser(message, user);
      });
  }

  private getMessagePayload(message: MessageDocument): any {
    return {
      _id: message._id,
      user: message.user._id ? message.user._id.toHexString() : message.user.toString(),
      nickname: message.nickname,
      content: message.content,
      room: message.room._id || message.room.toString(),
      time: message.time.toUTCString()
    }
  }

  private send(message: MessageDocument): void {
    this.server.emit('msg', this.getMessagePayload(message));
  }

  private sendToUser(message: MessageDocument, user: UserDocument): void {
    user.emit('msg', this.getMessagePayload(message));
  }

  private onMessageSent(user: UserDocument, data: MessageRequest): void {
    if (!user.room || !data.content || data.content.length == 0) {
      return;
    }

    Messages.create({
      user: user,
      nickname: user.nickname,
      content: data.content,
      room: user.room
    }, (err, message: MessageDocument) => {
      this.send(message);
    });
  }

  /**
   * Called when the user requests to edit a message. If the user is allowed to,
   * then this will edit the message.
   * 
   * @param user The user that made the edit request.
   * @param data Information about the edit event.
   */
  private onMessageEdit(user: UserDocument, data: any): void {
    Messages.findOne(data.messageId, (err, message: MessageDocument) => {
      // Do nothing if the message data could not be retrieved.
      if (err) {
        return;
      }

      // Do nothing if the user did not create the message.
      if (!user.equals(message.user)) {
        return;
      }

      const content = (data.content || '').toString().trim();

      // Make sure the new content is not empty.
      if (content.length === 0) {
        return;
      }

      message.content = data.content;
      message.save();
    });
  }

  private onMessageDelete(user: UserDocument, data: any): void {

  }

  private onUserTypingStateChanged(user: UserDocument, isTyping: boolean): void {
    isTyping = !!isTyping;

    console.log('--------------------');
    console.log(isTyping);
    this.server.users.forEach((other: UserDocument) => {
      if (other._id !== user._id && other.room && user.room && other.room.equals(user.room)) {
        console.log('typing for ', other.nickname)
        other.emit('typing', {
          userId: user._id,
          isTyping: isTyping
        });
      }
    });
  }
}