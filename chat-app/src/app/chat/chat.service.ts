import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
  private socket;
  private _messages: Subject<string>;
  private _motd: Subject<string>;
  private messageStore: string[];
  private nickname: string;

  constructor() {
    this.socket = io();
    console.log(this.socket.id);
    this.messageStore = [];
    this._messages = new Subject<string>();
    this._motd = new Subject<string>();

    this.socket.on('message', (message: string) => {
      this._messages.next(message);
    });

    this.socket.on('motd', (motd: string) => {
      this._motd.next(motd);
    });
  }

  sendMessage(message: string) {
    message = message.trim();

    if (message.length == 0) {
      return;
    }
    
    this.socket.emit('message', message);
    this._messages.next(this.nickname + ": " + message);
  }

  getMessages() {
    return this._messages.asObservable();
  }

  getMotd() {
    return this._motd.asObservable();
  }

  loadMessages() {
    this.socket.on('messages', (messages: string[]) => {
      this.messageStore = messages;

      for (const message of messages) {
        this._messages.next(message);
      }
    });

    this.socket.emit('getMessages');
  }

  setNickname(nickname: string) {
    this.nickname = nickname;
    this.socket.emit('nickname', nickname);
  }
}
