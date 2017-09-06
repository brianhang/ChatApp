export interface Room {
  name: string;
  description: string;
  password: string;
  ownerId: string;
  bans: string[];
}
