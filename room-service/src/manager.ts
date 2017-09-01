import { Gateway } from './gateway/gateway';
import { RoomDocument } from './interfaces/room-document';
import { getRoomPayload } from './util';
import { Rooms } from './models/rooms';

export class RoomManager {
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
    const payload = getRoomPayload(room);
    this.gateway.send('gateway', 'sendToUser', userId, 'roomData', payload);
  }
}