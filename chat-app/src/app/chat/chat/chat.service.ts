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
  private _disconnected: boolean;
  private events: Map<string, Function>;

  /**
   * Constructor which sets up the socket to communicate with the chat server.
   */
  constructor() {
    this._users = new Map<string, User>();
    this._user = undefined;
    this.events = new Map<string, Function>();
    this.connected = false;
  }

  /**
   * Connects to the chat server.
   *
   * @return A promise that is called after the connection has been made.
   */
  public connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.connected) {
        return;
      }

      const token = localStorage.getItem('chat-app-jwt');

      this.socket = io({
        path: '/gateway/socket.io',
        query: `token=${token}`
      });

      this.socket.on('connect', () => this.onSocketConnected(resolve, reject));
    });
  }

  /**
   * Called when the socket connection has been established. This will set up
   * the socket client.
   *
   * @param resolve Resolve the connection promise.
   * @param reject Raise an error in the connection process.
   */
  private onSocketConnected(resolve: Function, reject: Function): void {
    // Set up listeners for events that may have been created before connecting.
    this.events.forEach((listener, event) => {
      this.socket.on(event, listener);
    });

    // Event for getting data about other connected users.
    this.on('userData', data => {
      const oldData = this._users.get(data._id);
      const newData = Object.assign(oldData || {}, data);

      this._users.set(data._id, newData);
    });

    // Event for user nickname changes.
    this.on('nickname', data => this.onNicknameChange(data));

    // Event for when the local user has finished loading.
    this.on('joined', data => {
      data.room = undefined;

      this._user = data;
      this._users.set(data._id, data);

      this.connected = true;
      resolve();
    });

    // Event for leaving the chat room.
    this.on('logout', reject);
    this.on('disconnect', data => this._disconnected = true);
  }

  /**
   * Adds a listener for an event from the server.
   *
   * @param event The name of the event to listen for.
   * @param listener What to do when the event is fired.
   */
  public on(event: string, listener: Function): void {
    this.events.set(event, listener);

    if (this.socket) {
      this.socket.on(event, listener);
    }
  }

  /**
   * Emits an event to the server.
   *
   * @param event The name of the event to emit.
   * @param data The data to send with the event.
   */
  public emit(event: string, data: any): void {
    if (this.socket) {

      this.socket.emit(event, data);
    }
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

  /**
   * Called when a user has changed their nickname. This will replicate the
   * change.
   *
   * @param data Information about the change.
   */
  private onNicknameChange(data: any): void {
    const user = this.getUserById(data.userId);
    const nickname = data.nickname;

    if (user) {
      user.nickname = nickname;
    }
  }

  /**
   * Returns whether or not we are disconnected from the server.
   *
   * @return True if we disconnected from the server.
   */
  public get disconnected(): boolean {
    return this._disconnected;
  }
}
