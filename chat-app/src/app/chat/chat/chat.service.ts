import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { User } from './models/user';
import { Message } from '../message/models/message';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
  private socket;
  private connected: boolean;
  private _users: Map<string, User>;
  private _user: User;

  /**
   * Constructor which sets up the socket to communicate with the chat server.
   */
  constructor() {
    this._users = new Map<string, User>();
    this._user = undefined;

    this.socket = io();
    this.connected = false;

    this.on('userData', data => {
      this._users.set(data._id, data);
    });

    this.on('joined', data => {
      this._user = data;
      this._users.set(data._id, data);

      this.connected = true;

      console.log(this._users)
    });
  }

  /**
   * Adds a listener for an event from the server.
   *
   * @param event The name of the event to listen for.
   * @param listener What to do when the event is fired.
   */
  public on(event: string, listener: Function): void {
    this.socket.on(event, listener);
  }

  /**
   * Emits an event to the server.
   *
   * @param event The name of the event to emit.
   * @param data The data to send with the event.
   */
  public emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  /**
   * Returns a user in the chat room corresponding to the given user ID.
   *
   * @param userId The ID of the desired user.
   * @returns The user with the matching ID if found, undefined otherwise.
   */
  public getUserById(userId: string): User {
    return this._users.get(userId);
  }

  /**
   * Returns the local user object.
   *
   * @return The local user.
   */
  public get user(): User {
    return this._user;
  }
}
