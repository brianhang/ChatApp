import { Service, ServiceEvent, ServiceSubscription } from './gateway/service';
import { Messages } from './models/messages';
import { HISTORY_LENGTH } from './constants';
import { MessageDocument } from './interfaces/message-document';
import { getMessagePayload } from './util';

export class MessageService extends Service {
  // A map from users to the room they are in.
  private users: Map<string, string>;

  onInit(): void {
    this.users = new Map<string, string>();

    // Connect to the message database.
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGO_DB, {
      keepAlive: true,
      reconnectTries: 100,
      useMongoClient: true
    });
  }

  public sendToUser(
    message: MessageDocument,
    userId: string,
    reverse?: boolean
  ): void {
    const event = reverse ? 'msgRev' : 'msg';
    const payload = getMessagePayload(message);
    
    this.gateway.send('gateway', 'sendToUser', userId, event, payload);
  }

  public broadcast(message: MessageDocument): void {
    this.users.forEach((roomId, userId) => {
      if (roomId === message.room.toHexString()) {
        this.sendToUser(message, userId);
      }
    });
  }

  @ServiceSubscription()
  public onUserChangedRoom(userId: string, roomId: string): void {
    this.users.set(userId, roomId);
    console.log(userId, roomId);
  }

  @ServiceEvent()
  public onSend(userId: string, data: any): void {
    // Get the room the user is in.
    const roomId = this.users.get(userId);

    if (!roomId) {
      return;
    }

    // Redirect through the user service to add the nickname data.
    if (!data.nickname) {
      // Make sure the message content is worth sending.
      data.content = (data.content || '').toString().strip();

      if (data.content.length < 1) {
        return;
      }

      // Then ask the user service for the user's nickname.
      this.gateway.send('user', 'appendNickname', userId, data);

      return;
    }

    // Isolate the nickname and original data.
    const nickname = data.nickname;
    data = data.data;
    console.log(nickname, data.content, roomId);
    // Finally, create and store the message.
    Messages.create({
      user: userId,
      nickname: nickname,
      content: data.content,
      room: roomId
    }, (err: any, message: MessageDocument) => {
      if (err || !message) {
        return;
      }

      // Then send it so users can see it.
      this.broadcast(message);
    })
  }

  @ServiceEvent()
  public onTyping(userId: string, typing: boolean): void {
    typing = !!typing;

    this.gateway.send('gateway', 'broadcast', 'typing', {
      userId: userId,
      typing: typing
    });
  }

  @ServiceEvent()
  public onEdit(userId: string, data: any): void {
    // Helper function to send an edit response back.
    const result = (err?: string) => {
      this.gateway.send('gateway', 'sendToUser', userId, 'msgEditResult', err);
    }

    // Make sure the new message content is okay.
    const messageId = data.messageId;
    const content = (data.content || '').toString().trim();

    if (content.length < 1) {
      return result('Your new message is too short');
    }

    // Find the message that should be updated.
    Messages.findById(messageId, (err, message) => {
      // Validate that the user is allowed to edit this message.
      if (err) {
        return result(err);
      }

      if (!message) {
        return result('Message not found');
      }

      if (message.user.toHexString() !== userId) {
        return result('You are not allowed to edit this message');
      }

      // If everything is okay, actually update the server.
      message.content = content;
      message.save();

      // Then, replicate the message update to the users.
      const payload = {
        messageId: messageId,
        content: message.content
      };

      for (let userId of this.users.keys()) {
        this.gateway.send('gateway', 'sendToUser', userId, 'msgEdit', payload);
      }

      // Finally, indicate the message was successfully updated.
      result(undefined);
    });
  }

  @ServiceEvent()
  public onDelete(userId: string, messageId: any): void {
    messageId = (messageId || '').toString();

    // Find the message that needs to be deleted.
    Messages.findById(messageId)
      .select({ user: true, room: true })
      .exec((err, message: MessageDocument) => {
        if (err || !message) {
          return;
        }

        // Make sure the user is allowed to delete this message.
        if (message.user.toHexString() !== userId) {
          return;
        }

        // Replicate the deletion of the message.
        this.users.forEach((roomId, userId) => {
          if (roomId === message.room.toHexString()) {
            this.gateway.send(
              'gateway',
              'sendToUser',
              userId,
              'msgDelete',
              messageId
            );
          }
        });

        // Finally, actually delete the message.
        message.remove();
      });
  }

  @ServiceEvent()
  public onRequestOlder(userId: string, beforeTime: any): void {
    const date = new Date((beforeTime || '').toString());
    const roomId = this.users.get(userId);

    // We need to know both the date and room to find older messages.
    if (!date || !roomId) {
      return;
    }

    // Find the last few messages before the given date.
    Messages.find({
      room: roomId,
      time: { $lt: date }
    })
      .lean()
      .sort({ time: -1 })
      .limit(HISTORY_LENGTH)
      .cursor()
      .eachAsync(message => this.sendToUser(message, userId, true))
      .then(() => {
        this.gateway.send(
          'gateway',
          'sendToUser',
          userId,
          'msgRequestOlderResult'
        );
      });
  }
}