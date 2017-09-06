import { GatewayService } from '../service';
import { Users } from '../models/user';

module.exports = function(service: GatewayService): void {
  service.on('roomAdd', (userId: string, data: any) => {
    service.gateway.send('room', 'add', userId, data);
  });

  service.on('roomJoin', (userId: string, data: any) => {
    const roomId = (data.roomId || '').toString();
    const password = (data.password || '').toString();

    // Append the username to the request.
    Users.findById(userId)
      .select('username')
      .exec((err, user) => {
        if (err || !user) {
          return;
        }

        // Forward the request to the room service.
        service.gateway.send(
          'room',
          'roomJoin',
          userId,
          roomId,
          user.username,
          password
        );
      });
  });

  service.on('roomLeave', (userId: string, data: any) => {
    service.gateway.send('room', 'roomLeave', userId);
  });

  service.on('roomEdit', (userId: string, data: any) => {
    service.gateway.send('room', 'edit', userId, data);
  });

  service.on('roomBans', (userId: string, data: any) => {
    service.gateway.send('room', 'bans', userId, data);
  });

  service.on('roomOwnerBan', (userId: string, data: any) => {
    if (typeof(data.target) === 'string') {
      // Append the target's user ID to the data.
      Users.findOne({ username: data.target })
        .select('_id')
        .exec((err, user) => {
          if (err || !user) {
            return;
          }

          data.targetId = user._id.toHexString();

          // Then forward the request to the actual service.
          service.gateway.send('room', 'ban', userId, data);
        });
    }
  });

  service.on('roomOwnerKick', (userId: string, data: any) => {
    service.gateway.send('room', 'kick', userId, data);
  });
}
