import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
  private socket;
  private _messages: Subject<string>;
  private messageStore: string[];

  constructor() {
    this.socket = io();
    this.messageStore = [];
    this._messages = new Subject<string>();

    this.socket.on('message', (message: string) => {
      this._messages.next(message);
    });
  }

  sendMessage(message: string) {
    this.socket.emit('message', message);
    this._messages.next(message);
  }

  getMessages() {
    return this._messages.asObservable();
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
}
