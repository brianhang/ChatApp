import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Room } from './models/room';
import { User } from '../chat/models/user';
import { ChatService } from '../chat/chat.service';

/**
 * The RoomService is responsible for handling room data between the server
 * and the client.
 */
@Injectable()
export class RoomService {
  // Subject for when a room has been added to the chat server.
  private _roomAdded: Subject<Room>;

  // Subject for when a room has been deleted from the chat server.
  private _roomDeleted: Subject<Room>;

  // A list of rooms in the chat server.
  private _rooms: Map<string, Room>;

  /**
   * Constructor that sets up listeners for room related messages.
   *
   * @param chatService Service for communicating with the chat server.
   */
  constructor(private chatService: ChatService) {
    this._roomAdded = new Subject<Room>();
    this._roomDeleted = new Subject<Room>();

    this._rooms = new Map<string, Room>();

    // Handle room data from the server.
    this.chatService.on('roomData', data => this.loadRoomData(data));

    // Handle room data editting.
    this.chatService.on('roomEdit', data => this.editRoomData(data));

    // Handle room deleting.
    this.chatService.on('roomDelete', data => this.deleteRoom(data));

    // Handle users joining rooms.
    this.chatService.on('roomJoin', data => {
      const user: User = this.chatService.getUserById(data.userId);
      const room: Room = this._rooms.get(data.roomId);

      if (user && room) {
        this.onUserJoinRoom(user, room);
      }
    });

    // Handle users leaving rooms.
    this.chatService.on('roomLeave', data => {
      const user = this.chatService.getUserById(data.userId);

      if (user && user.room) {
        this.onUserLeaveRoom(user);
      }
    });
  }

  /**
   * Called when room data is being replicated on the client for a particular
   * room.
   *
   * @param data Data about a particular room.
   */
  private loadRoomData(data: any): void {
    console.log(data);
    if (!data) {
      return;
    }

    const room = new Room(data.id, data.name, data.owner);
    room.description = data.description;
    room.hasPassword = data.hasPassword;

    this.addRoom(room);

    if (!data.users) {
      return;
    }

    data.users.forEach(userId => {
      const user = this.chatService.getUserById(userId);

      if (user) {
        // Fix since the server sends invalid room data before this.
        user.room = undefined;

        room.addUser(user);
      }
    });
  }

  /**
   * Called when room data has been modified from the server.
   *
   * @param data Data about the modification.
   */
  private editRoomData(data: any): void {
    // Get the room that should be modified.
    const room = this._rooms.get(data.roomId);

    if (!room) {
      console.error(`Edit for non-existent room! (${data.roomId})`);

      return;
    }

    // Modify the room accordingly.
    const field = data.field;
    const value = data.value;

    room[field] = value;
  }

  /**
   * Adds a room to the list of rooms available in the chat server.
   *
   * @param room The room that will be added.
   */
  private addRoom(room: Room): void {
    if (this._rooms.get(room.id)) {
      return;
    }

    this._rooms.set(room.id, room);
    this._roomAdded.next(room);
  }

  /**
   * Deletes a room from the list of available rooms in the chat server.
   *
   * @param room The room that will be deleted.
   */
  private deleteRoom(id: string): void {
    const room = this._rooms.get(id);

    if (room) {
      this._roomDeleted.next(room);
      this._rooms.delete(id);
    }
  }

  /**
   * Helper function to eject a user from the room they are in.
   *
   * @param user The desired user.
   */
  private ejectUser(user: User): void {
    if (user && user.room) {
      user.room.removeUser(user);
    }
  }

  /**
   * Called when a user changes which room they are in.
   *
   * @param user The user that has joined a room.
   * @param room The room that the user changed to.
   */
  private onUserJoinRoom(user: User, newRoom: Room | undefined): void {
    this.ejectUser(user);

    if (newRoom) {
      newRoom.addUser(user);
    }
  }

  /**
   * Called when a user has left a room. This will remove the user from the
   * room locally.
   *
   * @param user The user that left a room.
   */
  private onUserLeaveRoom(user: User): void {
    this.ejectUser(user);
  }

  /**
   * Finds and returns a room with an ID matching the given ID.
   *
   * @param id The desired room.
   * @return The room with matching ID if found.
   */
  public getRoomById(id: string): Room {
    return this._rooms.get(id);
  }

  /**
   * Returns an observable that is a stream of rooms that have been created.
   *
   * @return A stream of rooms that were just created.
   */
  public get roomAdded(): Observable<Room> {
    return this._roomAdded.asObservable();
  }

  /**
   * Returns an observable that is a stream of rooms that have been deleted.
   *
   * @return A stream of rooms that were just deleted.
   */
  public get roomDeleted(): Observable<Room> {
    return this._roomDeleted.asObservable();
  }

  /**
   * Sends a request to the chat server to join the given room.
   *
   * @param room The room that the user wants to join.
   */
  public join(room: Room, password?: string): void {
    this.chatService.emit('roomJoin', { roomId: room.id, password: password });
  }

  /**
   * Sends a request to the server to leave the current room.
   */
  public leave(): void {
    this.chatService.emit('roomLeave', undefined);
  }

  /**
   * Requests to have a user kicked from the room that the local user is in.
   *
   * @param target The desired user to kick.
   */
  public kick(target: User): void {
    this.chatService.emit('roomOwnerKick', target._id);
  }
}
