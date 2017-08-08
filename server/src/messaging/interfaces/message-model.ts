/**
 * The Message interface represents a message in the chat server.
 */
import { Room } from "../../room/room";

export interface Message {
  nickname: string;
  content: string;
  room: Room;
  time: number;
}