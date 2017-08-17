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
    this.server.on('roomBans', (user: UserDocument) => this.onRequestBanList(user));
    this.server.on('roomOwnerBan', (user: UserDocument, data: any) => this.onRequestBan(user, data));
  }

  private onRequestKick(user: UserDocument, targetId: string): void {
    const room = user.room;

    if (!room || !user.equals(room.owner)) {
      return;
    }

    const target = this.server.users.find(x => x._id.toHexString() === targetId);

    if (target && target.room && target.room.equals(room)) {
      this.util.ejectUser(target);
    }
  }

  private onRequestBanList(user: UserDocument): void {
    const room = user.room;

    if (!room || !user.equals(room.owner)) {
      return;
    }

    user.emit('roomBans', room.bans || []);
  }

  private onRequestBan(user: UserDocument, data: any): void {
    const room = user.room;
    const target: string = (data.target || '').toString();
    const set = !!data.set;

    if (target.length === 0) {
      return;
    }

    if (!room || !user.equals(room.owner)) {
      return;
    }

    let save = false;

    if (set) {
      if (!room.bans) {
        room.bans = [];
      }

      if (!room.bans.find(ban => ban === target)) {
        room.bans.push(target);
        save = true;
      }

      const targetUser = this.server.users.find(x => (<any>x).username === target);

      if (targetUser && targetUser.room && targetUser.room.equals(room)) {
        this.util.ejectUser(targetUser);
      }
    } else if (room.bans) {
      const oldLength = room.bans.length;
      room.bans = room.bans.filter(ban => ban !== target);

      save = (oldLength !== room.bans.length);
    }

    if (save) {
      room.save();
      console.log(room.bans);
      user.emit('roomBans', room.bans);
    }
  }
}