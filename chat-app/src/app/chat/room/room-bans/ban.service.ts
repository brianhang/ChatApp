import { Injectable } from '@angular/core';
import { ChatService } from '../../chat/chat.service';

@Injectable()
export class BanService {
  private _bans: string[];

  constructor(private chatService: ChatService) {
    this._bans = [];

    this.chatService.on('roomBans', bans => this._bans = bans);
  }

  public requestBans(): void {
    this.chatService.emit('roomBans', undefined);
  }

  public ban(ban: string): void {
    this.chatService.emit('roomOwnerBan', {
      target: ban,
      set: true
    });
  }

  public unban(ban: string): void {
    this.chatService.emit('roomOwnerBan', {
      target: ban,
      set: false
    });
  }

  public get bans(): string[] {
    return this._bans;
  }
}
