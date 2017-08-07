import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RoomService } from '../room.service';
import { Room } from '../models/room';
import { ChatService } from 'app/chat/chat.service';
import { User } from 'app/chat/models/user';

/**
 * The RoomListComponent is a list of all the rooms in the chat server. This
 * allows users to see all the rooms and users in the server.
 */
@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent {
  // A list of rooms in the chat server that will be displayed.
  protected rooms: Room[];

  /**
   * Constructor that sets up the listing of rooms.
   *
   * @param roomService The service to retrieve room information from.
   */
  constructor(private roomService: RoomService, private chatService: ChatService) {
    this.rooms = [];

    this.roomService.roomAdded.subscribe(room => {
      this.rooms.push(room);
    });
  }

  /**
   * Called when a room item has been clicked on.
   *
   * @param room The room that was clicked on.
   */
  protected onRoomClick(room: Room) {
    this.roomService.join(room);
  }

  /**
   * Returns the user that is viewing the chat room.
   *
   * @return The local user.
   */
  protected get user(): User {
    return this.chatService.user;
  }

  /**
   * Called when the user clicks the leave button.
   */
  protected onRoomLeaveClick(event): void {
    this.roomService.leave();
  }
}
