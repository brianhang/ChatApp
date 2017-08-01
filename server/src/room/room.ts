import { User } from '../core/user'
import { RoomService } from './service';

/**
 * The Room class is an area in the chat server where users can chat with
 * each other. Users who are in the room will be able to receive chat messages
 * from each other.
 */
export class Room {
  // Information about the room.
  private _name: string = "";
  private _description: string = "";

  // The users who are in this room.
  private users: Map<string, User>;

  /**
   * Constructor for a room that sets the room ID.
   * 
   * @param id The string ID for this room.
   */
  constructor(private id: string, private roomService: RoomService) {
    this.users = new Map<string, User>();
  }

  /**
   * Adds a user to this room so the user can communicate in the room.
   * 
   * @param user The user that should be added to this room.
   */
  addUser(user: User): void {
    if (this.users.get(user.id)) {
      return;
    }

    this.users.set(user.id, user);
  }

  /**
   * Removes a user from this room so the user can no longer communicate
   * in the room.
   * 
   * @param user The user to remove.
   */
  removeUser(user: User): void {
    this.users.delete(user.id);
  }

  /**
   * Sets the name of this room and informs the users of this change.
   * 
   * @param name The new name for the room.
   */
  public set name(name: string) {
    this._name = name;
    this.roomService.setRoomName(this.id, name);
  }
}