import { Server } from '../core/server';
import { UserDocument } from '../core/interfaces/user-document';
import { RoomService } from './service';
import { Rooms } from "./models/rooms";
import { RoomDocument } from './interfaces/room-document';
import { RoomManager } from './manager';

/**
 * The RoomEditorService handles user events for creating, editing, and
 * deleting rooms in the chat server.
 */
export class RoomEditorService {
  /**
   * Constructor which sets up the service dependencies.
   * 
   * @param server The server to get events from.
   * @param roomService The service for handling room data.
   * @param roomManager The service for handling room state.
   */
  constructor(
    private server: Server,
    private roomService: RoomService,
    private roomManager: RoomManager
  ) {
    this.server.on('roomEdit', (user: UserDocument, data: any) => this.onRoomEdit(user, data));
  }

  /**
   * Called when a user wants to edit a room.
   * 
   * @param user The user that wants to requested the edit.
   * @param data The changes that were made.
   */
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
        user.emit('roomEditResult', {
          status: false,
          message: 'You are not allowed to modify this room'
        });

        return;
      }

      // Update fields that have new values specified.
      if (data.name !== undefined) {
        err = this.onRoomNameEdit(user, room, data.name);
      }

      if (!err && data.description !== undefined) {
        err = this.onRoomDescriptionEdit(user, room, data.description);
      }

      if (!err && data.password !== undefined) { 
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

  /**
   * Called when a user requests for a room to be deleted.
   * 
   * @param user The user that requested the deletion.
   * @param room The room that should be deleted.
   */
  private onRoomDelete(user: UserDocument, room: RoomDocument): void {
    this.roomManager.deleteRoom(room);
  }

  /**
   * Called after a user has requested to edit the name of a room.
   * 
   * @param user The user that made the edit.
   * @param room The room that should be edited.
   * @param name The new name of the room.
   */
  private onRoomNameEdit(
    user: UserDocument,
    room: RoomDocument,
    name: string
  ): string | void {
    // Validate the name first.
    name = (name || '').toString().trim();

    if (name.length == 0) {
      return 'The room name can not be empty';
    }

    // Then, actually update the room.
    this.roomManager.setRoomName(room, name);
  }

  /**
   * Called when a user requests to edit a room's description.
   * 
   * @param user The user that made the request.
   * @param room The room that should be modified.
   * @param description The new description for the room.
   */
  private onRoomDescriptionEdit(
    user: UserDocument,
    room: RoomDocument,
    description: string
  ): string | void {
    description = (description || '').toString().trim();

    this.roomManager.setRoomDescription(room, description);
  }

  /**
   * Called when a user requests to edit a room's password.
   * 
   * @param user The user that made the request.
   * @param room The room that should be modified.
   * @param password The new password for the room.
   */
  private onRoomPasswordEdit(
    user: UserDocument,
    room: RoomDocument,
    password: string
  ): string | void {
    password = (password || '').toString();

    this.roomManager.setRoomPassword(room, password);
  }
}