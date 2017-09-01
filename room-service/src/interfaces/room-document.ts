import { Room } from './room';
import { Document } from 'mongoose';

export interface RoomDocument extends Room, Document { }