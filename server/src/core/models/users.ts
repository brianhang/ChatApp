import { Schema, model } from 'mongoose';
import { UserDocument } from '../interfaces/user-document';

const schema = new Schema({
  nickname: { type: String, required: true }
});

// Add passport related fields for the users model.
const passportlocalMongoose = require('passport-local-mongoose');
schema.plugin(passportlocalMongoose);

export const Users = model<UserDocument>('User', schema);