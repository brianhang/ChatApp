import { RoomService } from './service';
import { Rooms } from './models/rooms';
import { RoomDocument } from './interfaces/room-document';
import { getRoomPayload } from './util';

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
    });
}