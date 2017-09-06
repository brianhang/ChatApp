import { User } from './user';
import { Document } from 'mongoose';

export interface UserDocument extends User, Document { }
