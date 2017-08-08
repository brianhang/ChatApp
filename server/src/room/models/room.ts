import { Schema, model } from 'mongoose';
import { RoomDocumentModel } from '../interfaces/room-document-model';

const schema = new Schema({
  name: String,
  description: String,
  owner: { type: Schema.Types.ObjectId, ref: 'Room' }
});

export const Room = model<RoomDocumentModel>('Room', schema);