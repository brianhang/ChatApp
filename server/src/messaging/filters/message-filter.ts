import { User } from '../../core/user';

export interface MessageFilter {
  /**
   * Returns whether or not the receipient can see the message sent from
   * the sender.
   * 
   * @param sender The user that sent the message.
   * @param recipient The user that may or may not see the message.
   * @return True if recipient should see the message, false otherwise.
   */
  check(sender: User, recipient: User): boolean;
}