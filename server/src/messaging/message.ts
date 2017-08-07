import { Room } from '../room/room'
/**
 * The Message class is a message that has been posted in the chat.
 */
export class Message {
  // The name of the user who made this message.
  public nickname: string;
  
  // The content of the message.
  public content: string;

  // The room that this message was sent to.
  public room: Room;

  // The time this message was created.
  public time: number;
}
