import { Service, ServiceEvent } from './gateway/service';
import * as socket from 'socket.io';
import { Users } from './models/user';

const expressJwt = require('express-jwt');

/**
 * The GatewayService acts as the single end point between the microservices
 * and the front end. This will handle all data moving between the services
 * and the front end.
 */
export class GatewayService extends Service {
  // The server's socket.
  public io: SocketIO.Server;

  // Invertible map for user to socket.
  public sockets: Map<string, SocketIO.Socket>;
  public users: Map<SocketIO.Socket, string>;

  // Listeners for events from client sockets.
  private listeners = new Map<string, any>();

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
    this.sockets = new Map<string, SocketIO.Socket>();
    this.users = new Map<SocketIO.Socket, string>();

    const httpServer = require('http').createServer(app);
    this.io = socket(httpServer);

    // Add authentication middleware for sockets.
    require('./socket-authentication')(this);

    this.io.on('connection', socket => this.onUserConnected(socket));
    
    // Set up service routes.
    require('./routes/user.ts')(this);
    require('./routes/room.ts')(this);
    require('./routes/message.ts')(this);

    httpServer.listen(80);
  }

  /**
   * Called when a socket client has connected to the server. This will set
   * up the main listeners for the socket.
   * 
   * @param socket The socket that has connected.
   */
  public onUserConnected(socket: SocketIO.Socket): void {
    // Add listners for the new socket.
    this.listeners.forEach((listener, event) => {
      socket.on(event, this.getListener(socket, listener));
    });

    socket.on('disconnect', () => {
      this.onUserDisconnected(socket);
    });

    // Authenticate the user from the socket. If the user could not be
    // authenticated, then disconnect the socket. Otherwise, indicate to the
    // user that a successful connection has been made.
    const userId = this.users.get(socket);

    if (!userId) {
      socket.emit('logout');

      return;
    }

    Users.findById(userId, { password: 0 }, (err, user) => {
      if (err) {
        console.error(`Failed to load user data for ${userId}: ${err}`);
      }

      if (user) {
        this.gateway.publish('userConnected', userId);
        socket.emit('joined', user);
      } else {
        socket.emit('logout');
      }
    });
  }

  /**
   * Called when a user disconnects from the server. This will do a cleanup of
   * the user/socket maps.
   * 
   * @param socket The socket that just disconnected.
   */
  public onUserDisconnected(socket: SocketIO.Socket): void {
    const userId = this.users.get(socket);

    if (userId) {
      this.users.delete(socket);
      this.sockets.delete(userId);
    }
  }

  /**
   * Sends an event to the socket of the user corresponding to the given ID.
   * 
   * @param userId The ID of the desired user to send an event to.
   * @param event The name of the event.
   * @param args Data about the event.
   */
  public sendToUser(userId: string, event: string, ...args: any[]): void {
    const socket = this.sockets.get(userId);

    if (socket) {
      socket.emit(event, ...args);
    }
  }

  /**
   * Sets up a listener for all sockets connected to the server.
   * 
   * @param event The name of the event to listen for.
   * @param listener What to do when this event occurs.
   */
  public on(event: string, listener: any): void {
    this.listeners.set(event, listener);

    this.sockets.forEach(socket => {
      socket.on(event, this.getListener(socket, listener));
    });
  }

  /**
   * Called when another service wants to send data back to a user. This will
   * delegate to the sendToUser helper method.
   * 
   * @param userId The ID of the desired user to send to.
   * @param event The name of the event to send.
   * @param args Data about the event.
   */
  @ServiceEvent()
  public onSendToUser(userId: string, event: string, ...args: any[]): void {
    this.sendToUser(userId, event, ...args);
  }

  /**
   * Called when another service wants to broadcast an event to every connected
   * user on the server. This will delegate to the actual server socket
   * broadcast method.
   */
  @ServiceEvent()
  public onBroadcast(event: string, ...args: any[]): void {
    console.log(event, args);
    this.io.emit(event, ...args);
  }

  /**
   * Helper method to get the user ID from a socket and to create a new
   * listener that takes in the user ID in addition to the event data.
   * 
   * @param socket The socket to get the listener for.
   * @param listener The old listener.
   */
  private getListener(socket: SocketIO.Socket, listener: any): any {
    const userId = this.users.get(socket);

    return function(...args: any[]) {
      listener(userId, ...args);
    }
  }
}