import { Service, ServiceEvent, ServiceSubscription } from './gateway/service';
import { Users } from './models/user';
import { UserDocument } from './interfaces/user-document';

export class UserService extends Service {
  private users = new Map<string, UserDocument>();
    
  public onInit(): void {
    // Connect to the authentication database.
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGO_DB, {
      keepAlive: true,
      reconnectTries: 100,
      useMongoClient: true
    });

    require('./nickname')(this);
  }

  @ServiceSubscription()
  public onUserConnected(userId: string): void {
    Users.findById(userId, (err, user) => {
      if (err) {
        return;
      }

      if (!user) {
        user = new Users({
          _id: userId,
          nickname: `Guest ${Math.floor(Math.random() * 10000)}`
        });
        user.save();
      }

      this.users.forEach(other => {
        this.gateway.send('gateway', 'sendToUser', other._id, 'userData', user);
        this.gateway.send('gateway', 'sendToUser', userId, 'userData', other);
      });

      this.users.set(userId, user);
      this.gateway.send('gateway', 'sendToUser', userId, 'userData', user);
    });
  }

  @ServiceSubscription()
  public onUserDisconnected(userId: string): void {
    this.users.delete(userId);
  }
}