import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RoomService } from '../room.service';
import { Room } from '../models/room';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent {
  protected rooms: Room[];

  constructor(private roomService: RoomService) {
    this.rooms = [];

    this.roomService.roomAdded.subscribe(room => {
      this.rooms.push(room);
    });
  }

  onRoomClick(room: Room) {
    console.log(room);
    this.roomService.join(room);
  }
}
