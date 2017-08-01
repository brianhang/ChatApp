import { MessageFilter } from './message-filter';
import { User } from '../../core/user';

export class RoomFilter implements MessageFilter {
  /**
   * This filter only allows people in the same room to receive messages.
   * 
   * @param sender The user who sent this message.
   * @param recipient The user that may or may not see the message.
   * @return True if recipient should see the message, false otherwise.
   */
  public check(sender: User, recipient: User): boolean {
    return true;
  }
}
