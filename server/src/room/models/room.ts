import { User } from '../../core/models/user';

export class Room {
  public name: string;
  public description: string;
  public password: string;
  public owner: User;
}