import { Server } from '../core/server';
import { RoomService } from './service';
import { UserDocument } from '../core/interfaces/user-document';
import { Rooms } from "./models/rooms";
import { RoomDocument } from "./interfaces/room-document";
import { RoomUtils } from './utils';
import { Users } from "../core/models/users";

export class RoomOwnerService {
  constructor(private server: Server, private roomService: RoomService, private util: RoomUtils) {
    this.server.on('roomOwnerKick', (user: UserDocument, data: any) => this.onRequestKick(user, data));
  }

  private onRequestKick(user: UserDocument, targetId: string): void {
    const room = user.room;

    if (!room || !user.equals(room.owner)) {
      return;
    }

    const target = this.server.users.find(x => x._id.toHexString() === targetId);

    if (target) {
      this.util.ejectUser(target);
    }
  }
}