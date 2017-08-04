import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Room } from '../../models/room';
import { User } from '../../../chat/models/user';

@Component({
  selector: 'app-room-list-item',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.scss']
})
export class RoomListItemComponent implements OnInit {
  @Input() room: Room;
  @Output() roomClick: EventEmitter<Room>;

  constructor() {
    this.roomClick = new EventEmitter<Room>();
  }

  ngOnInit() {
  }

  onClick(event: any) {
    this.roomClick.emit(this.room);
  }

  protected get users(): User[] {
    console.log(this.room.users);
    return this.room.users.filter(user => user.room && user.room.id === this.room.id);
  }
}
