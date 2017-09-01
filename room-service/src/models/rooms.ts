import { Schema, model } from 'mongoose';
import { RoomDocument } from '../interfaces/room-document';

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  password: { type: String },
  users: [{type: Schema.Types.ObjectId }],
  bans: [{ type: String }],
  ownerId: { type: Schema.Types.ObjectId, required: true },
});

export const Rooms = model<RoomDocument>('Room', schema);