import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { User } from './user';
import { Message } from './message';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
  private socket;

  private _state: Subject<string>;
  private _message: Subject<Message>;

  private userStore: Map<string, User>;

  private nickname: string;
  private connected: boolean;

  constructor() {
    this.socket = io();

    this.userStore = new Map<string, User>();

    this._state = new Subject<string>();
    this._message = new Subject<Message>();

    this.socket.on('userJoin', (data: any) => {
      const user = new User(data.userId);
      user.nickname = data.nickname;

      this.userStore.set(data.userId, user);

      if (data.isLocalUser) {
        this._state.next('connected');
      }

      console.log(user);
    });

    this.socket.on('message', (data: any) => {
      const message = new Message();
      message.nickname = data.nickname;
      message.content = data.content;

      console.log(message);
      this._message.next(message);
    });

    this.socket.on('userLeave', (userId: string) => {
      const user = this.userStore.get(userId);

      if (user) {
        console.log(user.nickname + ' has disconnected.');
        this.userStore.delete(userId);
      }
    });
  }

  getState(): Observable<string> {
    return this._state.asObservable();
  }

  join(nickname: string): void {
    this.nickname = nickname;
    this.socket.emit('join', this.nickname);
  }

  send(message: string): void {
    this.socket.emit('message', message);
  }

  onMessage(): Observable<Message> {
    return this._message.asObservable();
  }
}
