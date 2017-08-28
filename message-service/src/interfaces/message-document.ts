import { Message } from '../models/message';
import { Document } from 'mongoose';

export interface MessageDocument extends Message, Document { }