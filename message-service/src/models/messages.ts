import { Schema, model } from 'mongoose';
import { MessageDocument } from '../interfaces/message-document';

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  room: { type: Schema.Types.ObjectId, required: true },
  nickname: { type: String, required: true },
  content: { type: String, required: true },
  icon: { type: String },
  time: { type: Date, default: Date.now }
});

export const Messages = model<MessageDocument>('Message', schema);
