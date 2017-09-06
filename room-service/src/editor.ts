import { RoomService } from './service';
import { Rooms } from './models/rooms';
import { RoomDocument } from './interfaces/room-document';
import { getRoomPayload } from './util';
import { NAME_MAX_LENGTH, DESC_MAX_LENGTH } from './constants';

module.exports = function (service: RoomService): void {
  service.gateway
    /**
     * Handles room creation requests from users.
     */
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

    /**
     * Handles room settings changes.
     */
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
        const name = changes.name.trim().substring(0, NAME_MAX_LENGTH);

        if (name.length < 1) {
          err = 'Room name too short';
        } else {
          service.manager.update(room, 'name', name);
        }
      }

      if (!err && typeof(changes.description) === 'string') {
        const description = changes.description.trim().substring(0, DESC_MAX_LENGTH);
        service.manager.update(room, 'description', description);
      }

      if (!err && typeof(changes.password) === 'string') {
        service.manager.update(room, 'password', changes.password);
      }

      // Indicate the changes have been made.
      result(err === undefined, err);
    })

    /**
     * Handles room owner ban requests.
     */
    .on('ban', async (userId: string, data: any) => {
      // Get the room to edit.
      const room = await getWorkingRoom(userId);
      const target = data.target;
      const set = !!data.set;

      if (typeof(target) !== 'string') {
        return;
      }

      if (set) {
        room.bans.push(target);
        ejectUserFromRoom(data.targetId, room);
      } else {
        room.bans = room.bans.filter(ban => ban !== target);
      }

      room.save();
      service.gateway.send('gateway', 'sendToUser', userId, 'roomBans', room.bans);
    })

    /**
     * Handles room owner requests for the bans in a room.
     */
    .on('bans', async (userId: string) => {
      // Get the room to edit.
      const room = await getWorkingRoom(userId);

      service.gateway.send('gateway', 'sendToUser', userId, 'roomBans', room.bans);
    })

    /**
     * Handles room owner requests to kick a user.
     */
    .on('kick', async (userId: string, targetId: string) => {
      // Get the room to edit.
      const room = await getWorkingRoom(userId);

      ejectUserFromRoom(targetId, room);
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

  /**
   * Ejects the given user from the room if the user is in the room.
   */
  function ejectUserFromRoom(targetId: string, room: RoomDocument): void {
    const targetRoomId = service.manager.getUserRoomId(targetId);

    if (targetRoomId === room._id.toHexString()) {
      service.manager.setUserRoom(targetId, undefined);
    }
  }
}