import { User } from '../../chat/models/user';

/**
 * The Room class represents a chat room which users can communicate in.
 */
export class Room {
  // The users in this room.
  private _users: User[];

  /**
   * Constructor for the Room class that sets up the ID and name of the room.
   *
   * @param _id The unique identifier for the room.
   * @param name The nice name for the room.
   */
  constructor(private _id: string, public name: string) {
    this._users = [];
  }

  /**
   * Returns the ID of this room.
   *
   * @return A string containing the room's ID.
   */
  public get id() {
    return this._id;
  }

  /**
   * Adds the given user as a member of this room. If the user is already in
   * the room, then nothing happens. This allows the user to receive messages
   * in this room.
   *
   * @param user The user that should be added to the room.
   */
  public addUser(user: User): void {
    if (user.room === this) {
      return;
    }

    this._users.push(user);
    user.room = this;
  }

  /**
   * Removes the given user from this room so that user can no longer send
   * messages to the room. If the user is not in this room, nothing happens.
   *
   * @param user The user that should be removed.
   */
  public removeUser(user: User): void {
    this._users = this._users.filter(other => other.id !== user.id);

    if (user.room === this) {
      user.room = undefined;
    }
  }

  /**
   * Returns a list of users in this room.
   *
   * @return A list of users in this room.
   */
  public get users() {
    return this._users;
  }
}
