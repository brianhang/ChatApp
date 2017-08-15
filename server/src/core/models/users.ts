import { Schema, model } from 'mongoose';
import { UserDocument } from '../interfaces/user-document';
import { User } from './user';

const schema = new Schema({
  nickname: { type: String, required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room' }
});

schema.virtual('socket')
  .set(function (this: any, socket: SocketIO.Socket): void { this._socket = socket })
  .get(function (this: any): SocketIO.Socket { return this._socket });

schema.virtual('lastRoomJoin')
  .set(function (this: any, joinTime: Date) { this._lastRoomJoin = joinTime })
  .get(function (this: any): Date | undefined { return this._lastRoomJoin })

schema.method('emit', User.prototype.emit);
schema.method('notify', User.prototype.notify);
  
// Add passport related fields for the users model.
const passportlocalMongoose = require('passport-local-mongoose');
schema.plugin(passportlocalMongoose);

export const Users = model<UserDocument>('User', schema);