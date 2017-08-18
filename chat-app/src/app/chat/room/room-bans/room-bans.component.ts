import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Room } from '../models/room';
import { ChatService } from '../../chat/chat.service';
import { BanService } from './ban.service';

@Component({
  selector: 'app-room-bans',
  templateUrl: './room-bans.component.html',
  styleUrls: ['./room-bans.component.scss']
})
export class RoomBansComponent {
  @Input() protected room: Room;

  @Output() protected banClick: EventEmitter<string>;

  constructor(private banService: BanService) {
    this.banClick = new EventEmitter<string>();
    this.banService.requestBans();
  }

  protected onBanClick(ban: string): void {
    this.banService.unban(ban);
  }

  protected onAddBan(ban: string): void {
    this.banService.ban(ban);
  }

  protected get bans(): string[] {
    return this.banService.bans;
  }
}
