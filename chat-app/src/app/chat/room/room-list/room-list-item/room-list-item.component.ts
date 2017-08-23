import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Room } from '../../models/room';
import { User } from '../../../chat/models/user';
import { RoomService } from '../../room.service';

/**
 * The RoomListItemComponent represents a particular room in the list of rooms.
 */
@Component({
  selector: 'app-room-list-item',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.scss']
})
export class RoomListItemComponent {
  // Whether or not to show the edit button.
  @Input() showEdit: boolean;

  // Whether or not to show the leave button.
  @Input() showLeave: boolean;

  // The room that this item corresponds to.
  @Input() room: Room;

  // An event for when this item is clicked.
  @Output() roomClick: EventEmitter<Room>;

  // An event for when the leave button is clicked.
  @Output() roomLeaveClick: EventEmitter<any>;

  // An event for when a user's kick button was pressed.
  @Output() kickClick: EventEmitter<User>;

  // An event for when a user's ban button was pressed.
  @Output() banClick: EventEmitter<User>;

  /**
   * Empty constructor for the RoomListItemComponent.
   */
  constructor(private roomService: RoomService) {
    this.roomClick = new EventEmitter<Room>();
    this.roomLeaveClick = new EventEmitter<any>();
    this.kickClick = new EventEmitter<User>();
    this.banClick = new EventEmitter<User>();
  }

  /**
   * Called when the component has been clicked on. This will fire the roomClick
   * event.
   *
   * @param event Information about the click event.
   */
  public onClick(event: any) {
    this.roomClick.emit(this.room);
  }

  /**
   * Called when the leave button for the room has been clicked.
   *
   * @param event Information about the click event.
   */
  public onLeaveClick(event: any): void {
    this.roomLeaveClick.emit(this.room);
    event.stopPropagation();
  }

  /**
   * Called when the user clicks the button to kick another user.
   *
   * @param target The desired user to kick.
   */
  public onKickClick(event: any, user: User): void {
    this.kickClick.emit(user);
    event.stopPropagation();
  }

  /**
   * Called when the user clicks the button to ban another user.
   *
   * @param target The desired user to ban.
   */
  public onBanClick(event: any, user: User): void {
    this.kickClick.emit(user);
    event.stopPropagation();
  }
}
