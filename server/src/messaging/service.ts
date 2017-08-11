import { MessageDocument } from './interfaces/message-document';
import { MessageRequest } from './interfaces/message-request';
import { Server } from '../core/server';
import { UserDocument } from '../core/interfaces/user-document';
import { Messages } from "./models/messages";

const HISTORY_LENGTH = 250;

export class MessageService {

  constructor(private server: Server) {
    this.server.on('msg', (user: any, data: any) => this.onMessageSent(user, data));

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
      nickname: user.nickname,
      content: data.content,
      room: user.room
    }, (err, message: MessageDocument) => {
      this.send(message);
    });
  }
}