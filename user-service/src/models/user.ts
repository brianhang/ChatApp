import { Schema, model } from 'mongoose';
import { UserDocument } from '../interfaces/user-document';

const schema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  nickname: { type: String, required: true }
});

export const Users = model<UserDocument>('User', schema);
