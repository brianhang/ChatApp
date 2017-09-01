import { RoomDocument } from './interfaces/room-document';

/**
 * Creates a payload that the client expects to represent the given room.
 * 
 * @param room The room that should be used.
 */
export function getRoomPayload(room: RoomDocument): Object {
  return {
    id: room._id,
    name: room.name,
    owner: room.ownerId,
    description: room.description,
    hasPassword: (room.password || '').length > 0
  };
}