import { Room } from '../models/room';
import { Document } from 'mongoose';

export interface RoomDocument extends Room, Document { }