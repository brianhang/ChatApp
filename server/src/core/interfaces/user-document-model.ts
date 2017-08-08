import { UserModel } from './user-model';
import { Document } from 'mongoose';

export interface UserDocumentModel extends UserModel, Document { }