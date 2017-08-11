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
  // Whether or not to show the leave button.
  @Input() showLeave: boolean;

  // The room that this item corresponds to.
  @Input() room: Room;

  // An event for when this item is clicked.
  @Output() roomClick: EventEmitter<Room>;

  // An even for when the leave button is clicked.
  @Output() roomLeaveClick: EventEmitter<any>;

  /**
   * Empty constructor for the RoomListItemComponent.
   */
  constructor(private roomService: RoomService) {
    this.roomClick = new EventEmitter<Room>();
    this.roomLeaveClick = new EventEmitter<any>();
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
   * Called when the leave button for the room has been clicked.
   *
   * @param event Information about the click event.
   */
  protected onLeaveClick(event): void {
    this.roomLeaveClick.emit();
    event.stopPropagation();
  }
}
