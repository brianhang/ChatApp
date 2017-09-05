import { RoomService } from './service';
import { Rooms } from './models/rooms';
import { RoomDocument } from './interfaces/room-document';
import { getRoomPayload } from './util';
import { NAME_MAX_LENGTH, DESC_MAX_LENGTH } from './constants';

module.exports = function (service: RoomService): void {
  service.gateway
    // Handles room creation requests from users.
    .on('add', async (userId: string, data: any) => {
      /**
       * Helper function to send a room not created response back.
       */
      function fail(reason: string): void {
        service.gateway.send('gateway', 'sendToUser', userId, 'roomAdd', {
          status: false,
          message: reason
        });
      }

      // Validate the name of the room.
      let name = data.name;

      if (typeof(name) !== 'string') {
        return fail('You must provide a valid room name.');
      }

      name = name.trim();
      
      if (name.length < 1) {
        return fail('Your room name can not be empty.');
      }

      // Validate the other room fields.
      const description = (data.description || '').toString();
      const password = (data.password || '').toString();

      const room = await service.manager.create({
        name: name,
        description: description,
        password: password,
        ownerId: userId
      });

      // Notify the user that the room has been created.
      service.gateway.send('gateway', 'sendToUser', userId, 'roomAdd', {
        status: true
      });
    })
    .on('edit', async (userId: string, changes: any) => {
      function result(status: boolean, message?: string): void {
        service.gateway.send('gateway', 'sendToUser', userId, 'roomEditResult', {
          status: status,
          message: message
        });
      }

      // Get the room to edit.
      const room = await getWorkingRoom(userId);

      // If the room is to be deleted, then handle it.
      if (changes.delete) {
        service.manager.delete(room._id.toHexString());

        return result(true);
      }

      let err: string | undefined = undefined;

      // Update each key.
      if (typeof(changes.name) === 'string') {
        changes.name = changes.name.trim().substring(0, NAME_MAX_LENGTH);

        if (changes.name.length < 1) {
          err = 'Room name too short';
        } else {
          service.manager.update(room, 'name', changes.name);
        }
      }

      if (!err && typeof(changes.description) === 'string') {
        changes.description = changes.name.trim().substring(0, DESC_MAX_LENGTH);
        service.manager.update(room, 'name', changes.name);
      }

      if (!err && typeof(changes.password) === 'string') {
        service.manager.update(room, 'password', changes.password);
      }

      // Indicate the changes have been made.
      result(err === undefined, err);
    })
    .on('ban', (userId: string, data: any) => {
      // Get which room the user is in.
      // Make sure the user is allowed to edit that room.
      // 

    })
    .on('bans', (userId: string) => {
      // Get which room the user is in.
      // Make sure the user is allowed to edit that room.

    })
    .on('kick', (userId: string, targetId: string) => {
      // Get which room the user is in.
      // Make sure the user is allowed to edit that room.

    });

  /**
   * Retrieves the room that should be used for editting.
   * 
   * @param userId The user that wants to edit a room.
   */
  function getWorkingRoom(userId: string): Promise<RoomDocument> {
    // Helper function to indicate failure.
    function fail(message: string): void {
      service.gateway.send('gateway', 'sendToUser', userId, 'roomEditResult', {
        status: false,
        message: message
      });
    }

    return new Promise((resolve, reject) => {
      // Try to get the room the user is in.
      const roomId = service.manager.getUserRoomId(userId);

      if (!roomId) {
        return fail('You are not in a room');
      }

      // Try to get information about the room the user is in.
      Rooms.findById(roomId, (err, room) => {
        // Report any errors that occured.
        if (err) {
          return fail(err);
        }

        // If the room was not found, indicate it.
        if (!room) {
          return fail('The room you are trying to edit does not exist');
        }

        // Make sure the user is allowed to edit this room.
        if ((<any>room).ownerId.toHexString() !== userId) {
          return fail('You are not the owner of this room');
        }

        resolve(room);
      });
    });
  }
}