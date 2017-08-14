import { UserDocument } from '../../core/interfaces/user-document';

export class Room {
  public name: string;
  public description: string;
  public password: string;
  public owner: UserDocument;
}