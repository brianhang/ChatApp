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
  private _users: Subject<User[]>;

  private userStore: Map<string, User>;
  private userList: User[];

  private nickname: string;
  private connected: boolean;

  constructor() {
    this.socket = io();

    this.userStore = new Map<string, User>();

    this._state = new Subject<string>();
    this._message = new Subject<Message>();
    this._users = new Subject<User[]>();

    this.socket.on('userJoin', (data: any) => {
      const user = new User(data.userId);
      user.nickname = data.nickname;
      user.isTyping = data.isTyping;

      this.userStore.set(data.userId, user);
      this._users.next(this.getUserList());

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

    this.socket.on('typing', (data: any) => {
      const user = this.userStore.get(data.userId);
      const isTyping = data.isTyping;

      if (user) {
        user.isTyping = isTyping;
        console.log(user.nickname + ".typing = " + isTyping);
      }
    });

    this.socket.on('userLeave', (userId: string) => {
      const user = this.userStore.get(userId);

      if (user) {
        console.log(user.nickname + ' has disconnected.');
        this.userStore.delete(userId);
        this._users.next(this.getUserList());
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

  setTyping(isTyping: boolean): void {
    this.socket.emit('typing', isTyping);
  }

  private getUserList(): User[] {
    return Array.from(this.userStore.values());
  }

  getUsers(): Observable<User[]> {
    return this._users.asObservable();
  }
}
