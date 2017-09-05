import { Gateway } from './gateway/gateway';
import { RoomDocument } from './interfaces/room-document';
import { getRoomPayload } from './util';
import { Rooms } from './models/rooms';

export class RoomManager {
  // A map from user IDs to a room.
  public readonly users = new Map<string, string>();

  constructor(private gateway: Gateway) { }

  /**
   * Creates a room and replicates the state of the new room to all connected
   * users.
   * 
   * @param data The data to create a room with.
   */
  public create(data: any): Promise<RoomDocument> {
    return new Promise((resolve, reject) => {
      Rooms.create(data, (err: any, room: RoomDocument) => {
        if (err) {
          reject(err);
        }

        if (!room) {
          return;
        }

        // Replicate the room for all connected clients.
        const payload = getRoomPayload(room);
        this.gateway.send('gateway', 'broadcast', 'roomData', payload);

        resolve(room);
      });
    });
  }

  /**
   * Deletes a room permanently.
   * 
   * @param roomId The ID of the room that should be deleted.
   */
  public delete(roomId: string): void {
    this.gateway.send('gateway', 'broadcast', 'roomDelete', roomId);
    Rooms.findByIdAndRemove(roomId);
  }

  /**
   * Replicates the current state of the given room to the user corresponding
   * to the given user ID.
   * 
   * @param room The room that should be replicated.
   * @param userId The desired user to replicate the room for.
   */
  public replicate(room: RoomDocument, userId: string): void {
    const payload: any = getRoomPayload(room);
    payload.users = [];

    this.users.forEach((roomId, userId) => {
      if (roomId === room._id.toHexString()) {
        payload.users.push(userId);
      }
    });

    this.gateway.send('gateway', 'sendToUser', userId, 'roomData', payload);
  }

  /*
   * Updates which room the user is in and replicates the room state of the user
   * after the update.
   * 
   * @param userId The ID of the user to update.
   * @param room The room to move the user to. If null, then the user just
   *             leaves the room they are in.
   */
  public setUserRoom(userId: string, room?: RoomDocument): void {
    // Update the server side room state.
    this.users.set(userId, room ? room._id.toHexString() : undefined);

    // Update the room state on the client side.
    if (room) {
      this.gateway.send('gateway', 'broadcast', 'roomJoin', {
        userId: userId,
        roomId: room._id
      });
    } else {
      this.gateway.send('gateway', 'broadcast', 'roomLeave', {
        userId: userId
      });
    }
  }

  /**
   * Sets the name of a room and replicates the name change.
   * 
   * @param room The desired room to change.
   * @param name The new name for the room.
   */
  public update(room: RoomDocument, field: string, value: any): void {
    (<any>room)[field] = value;
    room.save();

    // Hide the actual password.
    if (field === 'password') {
      field = 'hasPassword';
      value = value ? value.length > 0 : false;
    }

    this.gateway.send('gateway', 'broadcast', 'roomEdit', {
      roomId: room._id.toHexString(),
      field: field,
      value: value
    });
  }

  /**
   * Returns the ID of which room the user is in.
   */
  public getUserRoomId(userId: string): string | undefined {
    return this.users.get(userId);
  }

  /**
   * Helper method to send a notification to a user.
   */
  private notify(userId: string, title: string, body: string, type: string) {
    this.gateway.send('gateway', 'sendToUser', userId, 'notice', {
      title: title,
      body: body,
      type: type
    });
  }
}