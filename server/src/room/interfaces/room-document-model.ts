import { Document } from 'mongoose';
import { RoomModel } from './room-model';

export interface RoomDocumentModel extends RoomModel, Document { }