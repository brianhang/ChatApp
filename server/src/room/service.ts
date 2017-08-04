import { Server } from '../core/server';
import { User } from '../core/user';
import { Room } from './room';

export class RoomService {
  private rooms: Map<string, Room>;

  constructor(private server: Server) {
    server.on('roomChange', (user: User, room: any) => this.onRoomChangeRequest(user, room));

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
  private onRoomChangeRequest(user: User, roomId: string | undefined) {
    if (user.room) {
      user.room.removeUser(user);      
    }

    // Get the desired room.
    if (roomId) {
      const room = this.rooms.get(roomId);

      console.log(user.id + ' -> ' + roomId);

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
  private replicateRoom(user: User, room: Room) {
    user.emit('roomData', {
      id: room.id,
      name: room.name,
      users: room.users.map(member => member.id)
    });
  }
}