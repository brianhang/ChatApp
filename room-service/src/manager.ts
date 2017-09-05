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
   * Returns the ID of which room the user is in.
   */
  public getUserRoomId(userId: string): string | undefined {
    return this.users.get(userId);
  }
}