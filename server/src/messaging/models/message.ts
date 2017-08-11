import { RoomDocument } from '../../room/interfaces/room-document';

export class Message {
  public nickname: string;
  public content: string;
  public time: Date;
  public room: RoomDocument;
}