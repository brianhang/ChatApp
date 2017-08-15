import { Server } from '../core/server';
import { Room } from './models/room';
import { User } from '../core/models/user';
import { Rooms } from './models/rooms';
import { RoomDocument } from "./interfaces/room-document";
import { RoomUtils } from './utils';
import { UserDocument } from '../core/interfaces/user-document';

export class RoomManager {
  private _rooms: Map<string, Room>;

  constructor(private server: Server, private utils: RoomUtils) {
    this._rooms = new Map<string, Room>();
  }

  /**
   * Sends the whole state of the given room to a particular client so the
   * client is sychronized with the server in terms of state for that room.
   * 
   * @param room The room that should be replicated.
   * @param user Who the room should be replicated for.
   * @return A promise that is called after the data has been sent.
   */
  public replicate(room: RoomDocument, user: User): Promise<void> {
    return this.utils.getUsers(room)
      .then((users: UserDocument[]) => {
        user.emit('roomData', {
          id: room._id,
          name: room.name,
          users: users.map(member => member._id),
          description: room.description,
          owner: room.owner._id || room.owner.toString()
        });

        return undefined;
      });
  }

  /**
   * Updates the name of a particular room and replicates the change for all
   * connected clients.
   * 
   * @param room The room that should be affected.
   * @param name The new name of the room.
   */
  public setRoomName(room: RoomDocument, name: string): void {
    room.name = name;
    room.save();

    this.server.emit('roomEdit', {
      roomId: room._id.toHexString(),
      field: 'name',
      value: name
    });
  }

  /**
   * Updates the description of a particular room and replicates the change
   * for all connected clients.
   * 
   * @param room The room that should be affected.
   * @param description The new description of the room.
   */
  public setRoomDescription(room: RoomDocument, description: string): void {
    room.description = description;
    room.save();

    this.server.emit('roomEdit', {
      roomId: room._id.toHexString(),
      field: 'description',
      value: description
    });
  }

  /**
   * Updates the password for the room and replicates whether or not the room
   * has a password for all clients. If the new password is an empty string,
   * this has the effect of removing the password.
   * 
   * @param room The room that should be affected.
   * @param password The new password for the room.
   */
  public setRoomPassword(room: RoomDocument, password: string): void {
    room.password = password;
    room.save();
  }

  /**
   * Deletes a room permanently.
   * 
   * @param room The room that should be deleted.
   */
  public deleteRoom(room: RoomDocument): void {
    Rooms.findByIdAndRemove(room._id.toHexString(), err => {
      if (err) {
        console.error('Failed to delete ' + room._id.toHexString() + ': ' + err);
      } else {
        this.server.emit('roomDelete', room._id);
      }
    });
  }
}