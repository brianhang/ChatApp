import { Schema, model } from 'mongoose';
import { UserDocument } from '../interfaces/user-document';
import { User } from './user';

const schema = new Schema({
  nickname: { type: String, required: true }
});

schema.virtual('socket')
  .set(function (this: any, socket: SocketIO.Socket): void { this._socket = socket })
  .get(function (this: any): SocketIO.Socket { return this._socket });

schema.method('emit', User.prototype.emit);
  
// Add passport related fields for the users model.
const passportlocalMongoose = require('passport-local-mongoose');
schema.plugin(passportlocalMongoose);

export const Users = model<UserDocument>('User', schema);