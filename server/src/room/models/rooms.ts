import { Schema, model } from 'mongoose';
import { RoomDocument } from '../interfaces/room-document';

const schema = new Schema({
  name: { type: String, required: true },
  description: String,
  password: String
});

export const Rooms = model<RoomDocument>('Room', schema);