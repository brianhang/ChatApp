import { Server } from '../core/server';
import { UserDocument } from '../core/interfaces/user-document';
import * as fs from 'fs';
import * as path from 'path';

const avatars = '../../../chat-app/dist/avatars';

export class UserService {
  constructor(private server: Server) {
    this.server.on('nickname', (user: UserDocument, data: any) => this.onNicknameChange(user, data));
    this.server.on('profilePic', (user: UserDocument, data: any) => this.onProfilePicChange(user, data));
  }

  private onNicknameChange(user: UserDocument, nickname: string): void {
    nickname = (nickname || '').toString().trim().substr(0, 32);

    if (nickname.length === 0) {
      return;
    }

    user.nickname = nickname;
    user.save();

    this.server.emit('nickname', {
      userId: user._id.toHexString(),
      nickname: nickname
    });
  }

  private onProfilePicChange(user: UserDocument, data: string): void {
    const prefix = /^data:image\/png;base64,/;
    const avatarsPath = path.join(__dirname, avatars);

    if (!data.match(prefix)) {
      return;
    }

    if (!fs.existsSync(avatarsPath)) {
      fs.mkdirSync(avatarsPath);
    }

    data = data.replace(prefix, '')
    data = new Buffer(data, 'base64').toString('binary');
    
    const outPath = avatarsPath + '/' + user._id.toHexString() + '.png';
    fs.writeFile(outPath, data, 'binary', (err) => {
      if (err) {
        console.error('Failed to upload avatar for ' + (<any>user).username);
        console.error(err);
      }
    });
  }
}