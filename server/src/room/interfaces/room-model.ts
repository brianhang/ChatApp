import { User } from '../../core/user';

export interface RoomModel {
  name: string,
  description: string,
  owner: User
}