import * as socket from 'socket.io';

const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

module.exports = function(
  io: SocketIO.Server,
  users: Map<string, SocketIO.Socket>
): void {
  io.use((socket, next) => {
    const token = socket.handshake.query.token;

    if (typeof(token) !== 'string') {
      return next(new Error('Invalid authentication token'));
    }

    jwt.verify(token, secret, (err: any, decoded: any) => {
      // If an error occured while doing so, send the error.
      if (err) {
        return next(new Error(err));
      }

      // Store the user who just connected.
      users.set(decoded.userId, socket);

      next();
    });
  });
}