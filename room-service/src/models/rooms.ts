import { Schema, model } from 'mongoose';
import { RoomDocument } from '../interfaces/room-document';
import { Room } from './room';

const schema = new Schema({
  name: { type: String, required: true },
  description: String,
  password: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  bans: [{ type: String }]
});

schema.method('getUsers', Room.prototype.getUsers);

export const Rooms = model<RoomDocument>('Room', schema);