import { UserService } from './service';
import { Users } from './models/user';

module.exports = function (service: UserService): void {
  /**
   * Helper function to return a valid nickname if possible. Otherwise, null
   * is returned.
   * 
   * @param nickname The nickname to validate.
   */
  function validateName(nickname: string): string | null {
    if (typeof(nickname) !== 'string') {
      return null;
    }

    nickname = nickname.trim();

    if (nickname.length < 1) {
      return null;
    }

    return nickname;
  }

  // Handles nickname update requests from users.
  service.gateway.on('nicknameChange', (userId: string, value: string) => {
    const nickname = validateName(value);

    if (!nickname) {
      return;
    }

    // Store the nickname change.
    Users.findOneAndUpdate(
      { _id: userId },
      { nickname: nickname },
      { upsert: true, new: true },
      (err, user) => {
        if (err) {
          console.error(`Failed to update nickname for ${userId}: ${err}`);

          return;
        }

        // Then, notify the clients.
        service.gateway.send('gateway', 'broadcast', 'nickname', {
          userId: userId,
          nickname: nickname
        });
      }
    )
  });
}