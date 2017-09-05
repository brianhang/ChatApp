import { Service, ServiceEvent, ServiceSubscription } from './gateway/service';
import { Rooms } from './models/rooms';
import { RoomDocument } from './interfaces/room-document';
import { RoomManager } from "./manager";
import { Gateway } from './gateway/gateway';

export class RoomService extends Service {
  public readonly manager: RoomManager;


  constructor(public readonly gateway: Gateway) {
    super(gateway);
    this.manager = new RoomManager(this.gateway);
  }

  onInit(): void {
    // Connect to the authentication database.
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGO_DB, {
      keepAlive: true,
      reconnectTries: 100,
      useMongoClient: true
    });

    require('./editor')(this);
  }

  @ServiceSubscription()
  public onUserConnected(userId: string): void {
    Rooms.find({})
      .lean()
      .cursor()
      .eachAsync(room => {
        this.manager.replicate(room, userId);
      });
  }

  @ServiceSubscription()
  public onUserDisconnected(userId: string): void {
    this.manager.setUserRoom(userId, undefined);
  }

  @ServiceEvent()
  public onRoomJoin(
    userId: string,
    roomId: string,
    username: string,
    password?: string
  ): void {
    /**
     * Helper function to send an error to the user.
     */
    const fail = (message: string) => {
      this.gateway.send('gateway', 'sendToUser', userId, 'notice', {
        title: 'Unable to join!',
        body: message,
        type: 'error'
      });
    }

    // Validate the room ID.
    if (typeof(roomId) !== 'string') {
      return;
    }

    // Make sure this room is not the one the user is already in.
    if (this.manager.getUserRoomId(userId) === roomId) {
      return;
    }

    // Try to get information about the room the user wants to join.
    Rooms.findById(roomId, (err, room) => {
      // Make sure the room exists.
      if (err) {
        return fail(err);
      }

      if (!room) {
        return fail('Room not found');
      }
      
      // Make sure the user is not banned.
      if (room.bans.find(ban => ban === username)) {
        return fail('You are banned from this rom');
      }

      // Make sure the password is correct, if there is one.
      if ((<any>room).ownerId.toHexString() !== userId &&
          room.password && room.password.length > 0 &&
          room.password !== password) {
        return fail('Incorrect password');
      }

      // Update the user's room state.
      this.manager.setUserRoom(userId, room);
    });
  }

  @ServiceEvent()
  public onRoomLeave(userId: string): void {
    this.manager.setUserRoom(userId, undefined);
  }
}