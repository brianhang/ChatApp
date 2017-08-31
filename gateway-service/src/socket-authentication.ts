import * as socket from 'socket.io';
import { GatewayService } from './service';

const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

module.exports = function(service: GatewayService): void {
  service.io.use((socket, next) => {
    const token = socket.handshake.query.token;

    if (typeof(token) !== 'string') {
      return next(new Error('Invalid authentication token'));
    }

    jwt.verify(token, secret, (err: any, decoded: any) => {
      // If an error occured while doing so, send the error.
      if (err) {
        return next(new Error(err));
      }

      const userId = decoded.userId;
      const oldSocket = service.sockets.get(userId);

      // Only allow a single connection per user.
      if (oldSocket) {
        oldSocket.disconnect(true);
      }

      // Store the user who just connected.
      service.sockets.set(userId, socket);
      service.users.set(socket, userId);

      next();
    });
  });
}