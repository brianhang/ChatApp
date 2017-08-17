import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RoomService } from '../room.service';
import { Room } from '../models/room';
import { ChatService } from '../../chat/chat.service';
import { User } from '../../chat/models/user';
import { RoomPasswordFormService } from '../room-password-form/room-password-form.service';

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
  constructor(
    private roomService: RoomService,
    private chatService: ChatService,
    private roomPasswordFormService: RoomPasswordFormService
  ) {
    this.rooms = [];

    this.roomService.roomAdded.subscribe(room => {
      this.rooms.push(room);
    });

    this.roomService.roomDeleted.subscribe(room => {
      this.rooms = this.rooms.filter(x => x.id !== room.id);
    });
  }

  /**
   * Called when a room item has been clicked on.
   *
   * @param room The room that was clicked on.
   */
  protected onRoomClick(room: Room) {
    if (room.hasPassword && room.owner !== this.chatService.user._id) {
      this.roomPasswordFormService.prompt()
        .then(password => this.roomService.join(room, password));
    } else {
      this.roomService.join(room);
    }
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

  /**
   * Called when a user's kick button has been clicked. This will send a request
   * to have that user kicked from the room.
   *
   * @param target The desired user to kick.
   */
  protected onKickClick(target: User): void {
    this.roomService.kick(target);
  }
}
