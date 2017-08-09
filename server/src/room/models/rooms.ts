import { Schema, model } from 'mongoose';
import { RoomDocument } from '../interfaces/room-document';

const schema = new Schema({
  name: String,
  description: String
});

export const Rooms = model<RoomDocument>('Room', schema);