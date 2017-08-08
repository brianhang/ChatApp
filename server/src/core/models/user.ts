import { Schema, model } from 'mongoose';
import { UserDocumentModel } from '../interfaces/user-document-model';

const schema = new Schema({
  nickname: String
});

export const User = model<UserDocumentModel>('User', schema);