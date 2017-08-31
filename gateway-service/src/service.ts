import { Service, ServiceEvent } from './gateway/service';
import * as socket from 'socket.io';
const expressJwt = require('express-jwt');

export class GatewayService extends Service {
  private io: SocketIO.Server;
  private users: Map<string, SocketIO.Socket>;

  onInit(): void {
    // Connect to the authentication database.
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGO_DB, {
      keepAlive: true,
      reconnectTries: 100,
      useMongoClient: true
    });

    // Set up the REST API end points.
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    require('./routes/authentication')(app);

    // Set up the server socket.
    this.users = new Map<string, SocketIO.Socket>();

    const httpServer = require('http').createServer(app);
    this.io = socket(httpServer);

    // Add authentication middleware for sockets.
    require('./socket-authentication')(this.io, this.users);

    this.io.on('connection', socket => this.onUserConnected(socket));
    
    httpServer.listen(80);
  }

  public onUserConnected(socket: SocketIO.Socket): void {
    socket.on('disconnect', () => {
      this.onUserDisconnected(socket);
    });
  }

  public onUserDisconnected(socket: SocketIO.Socket): void {
    this.users.forEach((other, key) => {
      if (socket == other) {
        this.users.delete(key);
      }
    });
  }

  public sendToUser(userId: string, event: string, ...args: any[]): void {
    const client = this.users.get(userId);

    if (client) {
      client.emit(event, args);
    }
  }

  @ServiceEvent()
  public onSendToUser(userId: string, event: string, ...args: any[]): void {
    this.sendToUser(userId, event, ...args);
  }
}