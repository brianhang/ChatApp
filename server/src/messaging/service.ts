import { MessageDocument } from './interfaces/message-document';
import { MessageRequest } from './interfaces/message-request';
import { Server } from '../core/server';
import { UserDocument } from '../core/interfaces/user-document';
import { Messages } from './models/messages';
import { RoomDocument } from '../room/interfaces/room-document';

const HISTORY_LENGTH = 250;

export class MessageService {

  constructor(private server: Server) {
    this.server.on('msg', (user: any, data: any) => this.onMessageSent(user, data));
    this.server.on('typing', (user: any, data: any) => this.onUserTypingStateChanged(user, data));
    this.server.on('msgEdit', (user: any, data: any) => this.onMessageEdit(user, data));
    this.server.on('msgDelete', (user: any, data: any) => this.onMessageDelete(user, data));
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

  public send(message: MessageDocument): void {
    this.server.users.forEach(user => {
      if (user.room && user.room.equals(message.room)) {
        this.sendToUser(message, user);
      }
    });
  }

  public sendToUser(message: MessageDocument, user: UserDocument): void {
    user.emit('msg', this.getMessagePayload(message));
  }

  public replicate(user: UserDocument, room: RoomDocument): void {
    let query: any = { room: room };
    const lastRoomJoin = (<any>user).lastRoomJoin;

    if (lastRoomJoin && lastRoomJoin.get(room._id.toHexString())) {
      query.time = {
        $gte: lastRoomJoin.get(room._id.toHexString())
      };
    }

    Messages.find(query)
      .sort('time')
      .limit(HISTORY_LENGTH)
      .cursor()
      .eachAsync((message: MessageDocument) => this.sendToUser(message, user));
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

      // Replicate the change for all users in the room.
      this.server.users.forEach(user => {
        if (user.room && user.room.equals(message.room)) {
          user.emit('msgEdit', {
            messageId: message._id,
            content: message.content
          });
        }
      });
    });
  }

  private onMessageDelete(user: UserDocument, messageId: string): void {
    messageId = (messageId || '').toString();

    Messages.findOne(messageId, (err, message: MessageDocument) => {
      // Do nothing if the message data could not be retrieved.
      if (err) {
        return;
      }

      // Do nothing if the user did not create the message.
      if (!user.equals(message.user)) {
        return;
      }

      // Replicate the deletion of the message.
      this.server.users.forEach(user => {
        if (user.room && user.room.equals(message.room)) {
          user.emit('msgDelete', message._id);
        }
      });

      // Actually delete the message.
      message.remove();
    });
  }

  private onUserTypingStateChanged(user: UserDocument, isTyping: boolean): void {
    isTyping = !!isTyping;

    this.server.users.forEach((other: UserDocument) => {
      if (other._id !== user._id && other.room && user.room && other.room.equals(user.room)) {
        other.emit('typing', {
          userId: user._id,
          isTyping: isTyping
        });
      }
    });
  }
}