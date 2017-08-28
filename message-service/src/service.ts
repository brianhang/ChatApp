import { MessageDocument } from './interfaces/message-document';
import { MessageRequest } from './interfaces/message-request';
import { Server } from '../core/server';
import { UserDocument } from '../core/interfaces/user-document';
import { Messages } from './models/messages';
import { RoomDocument } from '../room/interfaces/room-document';

// How far to look back for old messages.
const HISTORY_LENGTH = 75;

/**
 * The MessageService handles events involving user messages. This means it
 * handles the sending/receiving of messages, loading of messages, and
 * whether or not users are typing messages.
 */
export class MessageService {
  /**
   * Constructor for the messaging service which sets up the message events
   * for users.
   * 
   * @param server The server to receive events from.
   */
  constructor(private server: Server) {
    this.server.on('msg', (user: any, data: any) => this.onMessageSent(user, data));
    this.server.on('typing', (user: any, data: any) => this.onUserTypingStateChanged(user, data));
    this.server.on('msgEdit', (user: any, data: any) => this.onMessageEdit(user, data));
    this.server.on('msgDelete', (user: any, data: any) => this.onMessageDelete(user, data));
    this.server.on('msgRequestOlder', (user: any, data: any) => this.onUserRequestedOlderMessages(user, data));
  }

  /**
   * Returns the information that should be sent to users for them to get
   * information about a particular message. This is essentially a data
   * transfer object for the MessageDocument class.
   * 
   * @param message The desired message to send to a user.
   * @return The object that should be sent to users to understand the message.
   */
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

  /**
   * Sends the given message to the users that should see the message. That is,
   * the message is sent to users in the room that the message was made in.
   * 
   * @param message The message that should be sent.
   */
  public send(message: MessageDocument): void {
    this.server.users.forEach(user => {
      if (user.room && user.room.equals(message.room)) {
        this.sendToUser(message, user);
      }
    });
  }

  /**
   * Sends data about a message to a particular user. This allows a user to
   * see the message on the front end.
   * 
   * @param message The desired message to send.
   * @param user The user that should receive the message data.
   */
  public sendToUser(message: MessageDocument, user: UserDocument, reverse?: boolean): void {
    user.emit(reverse ? 'msgRev' : 'msg', this.getMessagePayload(message));
  }

  /**
   * Replicates the current state of messages sent for a user. This is for when
   * a user has joined a room and needs to see the current conversation.
   * 
   * @param user The desired user to replicate the state for.
   * @param room The room to replicate the message state for.
   */
  public replicate(user: UserDocument, room: RoomDocument): void {
    // Only get messages that were sent in the user's current room.
    let query: any = { room: room };
    const lastRoomJoin = (<any>user).lastRoomJoin;

    // Get new messages that the user has not seen yet.
    if (lastRoomJoin && lastRoomJoin.get(room._id.toHexString())) {
      query.time = {
        $gte: lastRoomJoin.get(room._id.toHexString())
      };
    }

    // Load and send the appropriate messages.
    Messages.find(query)
      .lean()
      .sort({time: -1})
      .limit(HISTORY_LENGTH)
      .cursor()
      .eachAsync((message: MessageDocument) => this.sendToUser(message, user, true));
  }

  /**
   * Called after a user has requested for a particular message to be sent. This
   * will handle actually creating and replicating a message for the request.
   * 
   * @param user The user that sent the request.
   * @param data Data about the message being sent.
   */
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
    Messages.findById(data.messageId, (err, message: MessageDocument) => {
      // Do nothing if the message data could not be retrieved.
      if (err) {
        user.emit('msgEditResult', err);

        return;
      }

      // Do nothing if the user did not create the message.
      if (!user.equals(message.user)) {
        user.emit('msgEditResult', 'Not allowed');

        return;
      }

      const content = (data.content || '').toString().trim();

      // Make sure the new content is not empty.
      if (content.length === 0) {
        user.emit('msgEditResult', undefined);

        return;
      }

      message.content = content;
      message.save();

      // Replicate the change for all users in the room.
      this.server.users.forEach(other => {
        if (other.room && other.room.equals(message.room)) {
          other.emit('msgEdit', {
            messageId: message._id,
            content: message.content
          });
        }
      });

      user.emit('msgEditResult', undefined);
    });
  }

  /**
   * Called when a user has requested for a particular message to be deleted.
   * This will actually delete the message if the requester sent the message.
   * 
   * @param user The user that wants to delete the message.
   * @param messageId The ID of the desired message to delete.
   */
  private onMessageDelete(user: UserDocument, messageId: string): void {
    messageId = (messageId || '').toString();

    Messages.findById(messageId, (err, message: MessageDocument) => {
      // Do nothing if the message data could not be retrieved.
      if (err || !message) {
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

  /**
   * Called when a user starts or stops typing. This will replicate the typing
   * state for everyone else so they know whether or not the user is typing.
   * 
   * @param user The user that the typing state is changing for.
   * @param isTyping True if the user is beginning to type, false otherwise.
   */
  private onUserTypingStateChanged(user: UserDocument, isTyping: boolean): void {
    // If the user is not in a room, typing state does not matter.
    if (!user.room) {
      return;
    }

    isTyping = !!isTyping;

    this.server.users.forEach((other: UserDocument) => {
      // The user already knows if they are typing.
      if (other.equals(user)) {
        return;
      }

      // Only users in the same room need to know about typing state.
      if (!other.room || !other.room.equals(user.room!)) {
        return;
      }
      
      other.emit('typing', {
        userId: user._id,
        isTyping: isTyping
      });
    });
  }

  /**
   * Called when a user wants to see even older messages in a room. This will
   * find the older messages and send them back. This is similar to the initial
   * loading of messages for a user.
   * 
   * @param user The user that requested older messages.
   * @param data Information about the request.
   */
  public onUserRequestedOlderMessages(user: UserDocument, date: any): void {
    if (!user.room) {
      return;
    }

    date = new Date((date || '').toString());

    Messages.find({
      room: user.room,
      time: {
        $lt: date
      }
    })
      .lean()
      .sort({time: -1})
      .limit(HISTORY_LENGTH)
      .cursor()
      .eachAsync((message: MessageDocument) => this.sendToUser(message, user, true))
      .then(() => user.emit('msgRequestOlderResult', undefined));
  }
}
