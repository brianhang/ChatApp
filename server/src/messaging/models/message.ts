import { Room } from '../../room/models/room';

export class Message {
  public nickname: string;
  public content: string;
  public time: Date;
  public room: Room;
}