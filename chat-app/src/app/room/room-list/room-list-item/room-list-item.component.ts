import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Room } from '../../models/room';
import { User } from '../../../chat/models/user';

/**
 * The RoomListItemComponent represents a particular room in the list of rooms.
 */
@Component({
  selector: 'app-room-list-item',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.scss']
})
export class RoomListItemComponent {
  // The room that this item corresponds to.
  @Input() room: Room;

  // An event for when this item is clicked.
  @Output() roomClick: EventEmitter<Room>;

  /**
   * Empty constructor for the RoomListItemComponent.
   */
  constructor() {
    this.roomClick = new EventEmitter<Room>();
  }

  /**
   * Called when the component has been clicked on. This will fire the roomClick
   * event.
   *
   * @param event Information about the click event.
   */
  protected onClick(event: any) {
    this.roomClick.emit(this.room);
  }

  /**
   * Returns a list of users in this room. This is so user items can be created
   * below this component to show the users in this room in the UI.
   */
  protected get users(): User[] {
    return this.room.users.filter(user => user.room && user.room.id === this.room.id);
  }
}
