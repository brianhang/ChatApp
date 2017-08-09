import { Schema, model } from 'mongoose';
import { MessageDocument } from '../interfaces/message-document';

const schema = new Schema({
  nickname: { type: String, required: true },
  content: { type: String, required: true },
  time: { type: Date, default: Date.now },
  room: { type: Schema.Types.ObjectId, ref: 'Room' }
});

export const Messages = model<MessageDocument>('Message', schema);