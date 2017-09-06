import { Message } from './message';
import { Document } from 'mongoose'

export interface MessageDocument extends Message, Document { }
