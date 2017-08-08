import { MessageModel } from './message-model';
import { Document } from 'mongoose';

export interface MessageDocumentModel extends MessageModel, Document { }