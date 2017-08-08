import { model, Schema } from 'mongoose';
import { MessageDocumentModel } from '../interfaces/message-document-model';

const schema = new Schema({
  nickname: { type: String, required: true },
  content: { type: String, minlength: 1, required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  time: { type: Date, default: Date.now }
});

export const Message = model<MessageDocumentModel>("Message", schema);