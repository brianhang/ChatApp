import { Room } from '../../room/models/room';

/**
 * The Message class is a message that has been posted in the chat.
 */
export interface MessageDto {
  _id: string;
  user: string;
  nickname: string;
  content: string;
  room: string;
  time: string;
}

export class Message {
  // A unique identifier for the message.
  public _id: string;

  // The ID of the user who made this message.
  public user: string;

  // The name of the user who made this message.
  public nickname: string;

  // The content of the message.
  public content: string;

  // The room that this messaged was posted in.
  public room: string;

  // The time this message was created.
  public time: Date;
}
