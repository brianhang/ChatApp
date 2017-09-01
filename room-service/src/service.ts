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
}