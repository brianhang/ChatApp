import { Server } from '../core/server';
import { UserDocument } from '../core/interfaces/user-document';
import * as fs from 'fs';
import * as path from 'path';

// Location of where the avatars should be saved.
const avatars = '../../../chat-app/dist/avatars';

/**
 * The UserService handles events for user settings.
 */
export class UserService {
  /**
   * Constructor for setting up the service events.
   * 
   * @param server The server to get events from.
   */
  constructor(private server: Server) {
    this.server.on('nickname', (user: UserDocument, data: any) => this.onNicknameChange(user, data));
    this.server.on('profilePic', (user: UserDocument, data: any) => this.onProfilePicChange(user, data));
  }

  /**
   * Called when the user requests to have their nickname changed.
   * 
   * @param user The user that made the request.
   * @param nickname The new nickname for the user.
   */
  private onNicknameChange(user: UserDocument, nickname: string): void {
    // Validate the username.
    nickname = (nickname || '').toString().trim().substr(0, 32);

    if (nickname.length === 0) {
      return;
    }

    // Update the username if it is valid.
    user.nickname = nickname;
    user.save();

    // Replicate the username change for the other users.
    this.server.emit('nickname', {
      userId: user._id.toHexString(),
      nickname: nickname
    });
  }

  /**
   * Called when a user requests to have their profile picture changed.
   * 
   * @param user The user that made the request.
   * @param data Binary data for the new profile picture.
   */
  private onProfilePicChange(user: UserDocument, data: string): void {
    // Validate the image data.
    const prefix = /^data:image\/png;base64,/;
    const avatarsPath = path.join(__dirname, avatars);

    if (!data.match(prefix)) {
      return;
    }

    // Create the directory to save pictures of it does not exist.
    if (!fs.existsSync(avatarsPath)) {
      fs.mkdirSync(avatarsPath);
    }

    // Convert the binary data into a buffer.
    data = data.replace(prefix, '')
    data = new Buffer(data, 'base64').toString('binary');
    
    // Write the image file.
    const outPath = avatarsPath + '/' + user._id.toHexString() + '.png';
    fs.writeFile(outPath, data, 'binary', (err) => {
      if (err) {
        console.error('Failed to upload avatar for ' + (<any>user).username);
        console.error(err);
      }
    });
  }
}