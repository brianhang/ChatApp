import { User } from '../core/user'
import { Message } from '../messaging/message';
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
  private _users: Map<string, User>;

  /**
   * Constructor for a room that sets the room ID.
   * 
   * @param _id The string ID for this room.
   */
  constructor(private _id: string, private roomService: RoomService) {
    this._users = new Map<string, User>();
    this._name = this._id;
  }

  /**
   * Allows the given user to receive events in this room.
   * 
   * @param user The user that should be added to this room.
   */
  addUser(user: User): void {
    if (this._users.get(user.id)) {
      return;
    }

    this._users.set(user.id, user);
    user.room = this;
  }

  /**
   * Stops a user from receiving events in this room.
   * 
   * @param user The user to remove.
   */
  removeUser(user: User): void {
    this._users.delete(user.id);
    user.room = undefined;
  }

  /**
   * Sets the name of this room and informs the users of this change.
   * 
   * @param name The new name for the room.
   */
  public set name(name: string) {
    this._name = name;
  }
  
  /**
   * Returns the ID of this room.
   * 
   * @return A string containing the room's ID.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Returns the name of this room.
   * 
   * @return A string containing this room's name.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Called when a user in this room has sent a message to the chat room.
   * 
   * @param sender The user that sent the message.
   * @param message The message that was sent.
   */
  public onMessageReceived(sender: User, message: Message): void {
    this._users.forEach(user => {
      user.emit('message', message);
    });
  }

  /**
   * Returns a list of users in the room.
   * 
   * @return A list of users in the room.
   */
  public get users(): User[] {
    return Array.from(this._users.values());
  }
}