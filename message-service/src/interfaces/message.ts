import { Schema } from 'mongoose';

export interface Message {
  user: any;
  room: any;
  nickname: string;
  content: string;
  time: Date;
}