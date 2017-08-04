import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Room } from './models/room';
import { User } from '../chat/models/user';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class RoomService {
  private _roomAdded: Subject<Room>;
  private _rooms: Map<string, Room>;

  constructor(private chatService: ChatService) {
    this._roomAdded = new Subject<Room>();
    this._rooms = new Map<string, Room>();

    this.chatService.on('roomData', data => this.loadRoomData(data));

    // Handle users joining rooms.
    this.chatService.on('roomChange', data => {
      const user: User = this.chatService.getUserById(data.userId);
      const room: Room | undefined = this._rooms.get(data.roomId);

      if (!user) {
        return;
      }

      this.onUserChangeRoom(user, room);
    });
  }

  /**
   * Called when room data is being replicated on the client for a particular
   * room.
   *
   * @param data Data about a particular room.
   */
  private loadRoomData(data: any): void {
    if (!data) {
      return;
    }

    const room = new Room(data.id, data.name);
    this.addRoom(room);

    data.users.forEach(userId => {
      const user: User = this.chatService.getUserById(userId);

      if (user) {
        room.addUser(user);
      }
    });
  }

  /**
   * Adds a room to the list of rooms available in the chat room.
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
   * Called when a user changes which room they are in.
   *
   * @param user The user that has joined a room.
   * @param room The room that the user changed to.
   */
  private onUserChangeRoom(user: User, room: Room | undefined): void {
    if (user.room) {
      user.room.removeUser(user);
    }

    if (room) {
      user.room = room;
      room.addUser(user);
    }
  }

  public get roomAdded(): Observable<Room> {
    return this._roomAdded.asObservable();
  }

  public join(room: Room): void {
    console.log(room.id);
    this.chatService.emit('roomChange', room.id);
  }
}
