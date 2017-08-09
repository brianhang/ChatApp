import { User } from '../models/user';
import { Document } from 'mongoose';

export interface UserDocument extends User, Document { }