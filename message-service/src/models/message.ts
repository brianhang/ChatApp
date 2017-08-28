import { RoomDocument } from '../../room/interfaces/room-document';
import { UserDocument } from '../../core/interfaces/user-document';

export class Message {
  public user: UserDocument;
  public nickname: string;
  public content: string;
  public time: Date;
  public room: RoomDocument;
}