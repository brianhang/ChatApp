import { MessageFilter } from './message-filter';
import { User } from '../../core/user';

export class GlobalFilter implements MessageFilter {
  /**
   * This filter means everyone sees the message.
   * 
   * @param sender The user who sent this message.
   * @param recipient The user that may or may not see the message.
   * @return True if recipient should see the message, false otherwise.
   */
  public check(sender: User, recipient: User): boolean {
    return true;
  }
}
