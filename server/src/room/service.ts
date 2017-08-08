import { Server } from '../core/server';
import { User } from '../core/user';
import { Room } from './room';

export class RoomService {
  private rooms: Map<string, Room>;

  constructor(private server: Server) {
    server.on('roomCreate', (user: User, data: any) => this.onRoomCreateRequest(user, data));
    server.on('roomChange', (user: User, room: any) => this.onRoomChangeRequest(user, room));
    server.on('roomLeave', (user: User) => this.onRoomLeaveRequest(user));

    this.rooms = new Map<string, Room>();
    this.rooms.set('general', new Room('general', this));
    this.rooms.set('brian', new Room('brian', this));
    this.rooms.set('alex', new Room('alex', this));
    this.rooms.set('michael', new Room('michael', this));

    server.userJoined.subscribe(user => {
      this.rooms.forEach(room => {
        this.replicateRoom(user, room);
      });
    });

    server.userLeft.subscribe(user => {
      if (user.room) {
        user.room.removeUser(user);

        this.server.emit('roomChange', {
          userId: user.id
        });
      }
    });
  }

  /**
   * Called when a user attempts to change to a room. This will handle moving
   * users into a room upon request. If the roomId is undefined, this is
   * equivalent to leaving the room.
   * 
   * @param user The user who wants to switch rooms.
   * @param room The room that the user wants to switch to.
   */
  private onRoomChangeRequest(user: User, roomId: string | undefined): void {
    if (user.room) {
      user.room.removeUser(user);      
    }

    // Get the desired room.
    if (roomId) {
      const room = this.rooms.get(roomId);

      if (!room) {
        return;
      }

      // Add the user to the room.
      room.addUser(user);
    }

    // Replicate this on the client side.
    this.server.emit('roomChange', {
      userId: user.id,
      roomId: roomId
    });
  }

  /**
   * Replicates the room data on the chat client of the given user.
   * 
   * @param user The user that the room data should be replicated for.
   * @param room The room that is being replicated.
   */
  private replicateRoom(user: User, room: Room): void {
    user.emit('roomData', {
      id: room.id,
      name: room.name,
      users: room.users.map(member => member.id)
    });
  }

  /**
   * Called when a user wants to leave their current room. This will eject the
   * user from their room if they are in a room.
   * 
   * @param user The user that wants to leave their current room.
   */
  private onRoomLeaveRequest(user: User): void {
    // Ignore if the use is not in a room.
    if (!user.room) {
      return;
    }

    // Remove the user and replicate it client side.
    user.room.removeUser(user);
    this.server.emit('roomChange', { userId: user.id });
  }

  /**
   * Called when the user requests a new room. This will create the room
   * instance and replicate it to everyone.
   * 
   * @param user The user that wants to create the room.
   * @param data Data about the room being created.
   */
  private onRoomCreateRequest(user: User, data: any): void {
    // Get the desired room name.
    const name = data.name.toString().trim();

    if (name.length == 0) {
      return;
    }

    // Create the room instance.
    const id = Math.random().toString();
    const room = new Room(id, this);
    room.name = name;

    this.rooms.set(id, room);

    // Replicate the room on the client side.
    this.server.getUsers().forEach(user => {
      this.replicateRoom(user, room);
    });
  }
}