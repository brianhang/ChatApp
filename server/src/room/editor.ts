import { Server } from '../core/server';
import { UserDocument } from '../core/interfaces/user-document';
import { RoomService } from './service';
import { Rooms } from "./models/rooms";
import { RoomDocument } from './interfaces/room-document';
import { RoomManager } from './manager';

export class RoomEditorService {
  constructor(private server: Server, private roomService: RoomService, private roomManager: RoomManager) {
    this.server.on('roomEdit', (user: UserDocument, data: any) => this.onRoomEdit(user, data));
  }

  private onRoomEdit(user: UserDocument, data: any): void {
    if (!data.roomId) {
      user.emit('roomEditResult', { status: false, message: 'Invalid room' });

      return;
    }

    // Find the room that the user wants to edit.
    Rooms.findById(data.roomId, (err, room) => {
      // Report back any errors.
      if (err) {
        user.emit('roomEditResult', { status: false, message: err });

        return;
      }

      // Make sure the user is the owner.
      if (!user.equals(room.owner)) {
        user.emit('roomEditResult', { status: false, message: 'You are not allowed to modify this room'});

        return;
      }

      // Update fields that have new values specified.
      if (data.name) {
        err = this.onRoomNameEdit(user, room, data.name);
      }

      if (!err && data.description) {
        err = this.onRoomDescriptionEdit(user, room, data.description);
      }

      if (!err && data.password) { 
        err = this.onRoomPasswordEdit(user, room, data.password);
      }

      if (data.delete) {
        this.onRoomDelete(user, room);
      }

      // Notify the owner of the change.
      if (err) {
        user.emit('roomEditResult', { status: false, message: err });
      } else {
        user.emit('roomEditResult', { status: true });
      }
    });
  }

  private onRoomDelete(user: UserDocument, room: RoomDocument): string | void {
    this.roomManager.deleteRoom(room);
  }

  private onRoomNameEdit(user: UserDocument, room: RoomDocument, name: string): string | void {
    name = (name || '').toString().trim();

    if (name.length == 0) {
      return 'The room name can not be empty';
    }

    this.roomManager.setRoomName(room, name);
  }

  private onRoomDescriptionEdit(user: UserDocument, room: RoomDocument, description: string): string | void {
    description = (description || '').toString().trim();

    this.roomManager.setRoomDescription(room, description);
  }

  private onRoomPasswordEdit(user: UserDocument, room: RoomDocument, password: string): string | void {
    password = (password || '').toString().trim();

    this.roomManager.setRoomPassword
  }
}