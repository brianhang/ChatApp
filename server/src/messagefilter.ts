import { User } from './user';

export interface MessageFilter {
  getRecipients(user: User): User[];
}