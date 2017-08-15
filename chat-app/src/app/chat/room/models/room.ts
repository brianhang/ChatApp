import { User } from '../../chat/models/user';

/**
 * The Room class represents a chat room which users can communicate in.
 */
export class Room {
  // The users in this room.
  private _users: User[];

  public description: string;

  public hasPassword: boolean;

  /**
   * Constructor for the Room class that sets up the ID and name of the room.
   *
   * @param _id The unique identifier for the room.
   * @param name The nice name for the room.
   */
  constructor(public _id: string, public name: string, private _owner: string) {
    this._users = [];
    this.description = '';
    this.hasPassword = false;
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
    if (user.room) {
      return;
    }

    const existingIndex = this._users.findIndex(x => x._id === user._id);

    if (existingIndex > -1) {
      this._users[existingIndex] = user;
    } else {
      this._users.push(user);
    }

    user.room = this;
  }

  /**
   * Removes the user that corresponds to the given ID from this room.
   *
   * @param userId The ID of the desired user.
   */
  public removeUserById(targetId: string): void {
    this._users = this._users.filter(user => user._id !== targetId);
  }

  /**
   * Removes the given user from this room so that user can no longer send
   * messages to the room. If the user is not in this room, nothing happens.
   *
   * @param target The user that should be removed.
   */
  public removeUser(target: User): void {
    if (target.room === this) {
      target.room = undefined;
    }

    this.removeUserById(target._id);
  }

  /**
   * Returns a list of users in this room.
   *
   * @return A list of users in this room.
   */
  public get users() {
    return this._users;
  }

  /**
   * Returns the ID of the user who owns the room.
   *
   * @return The user ID of the owner.
   */
  public get owner(): string {
    return this._owner;
  }
}
