import { Server } from '../core/server';
import { UserDocument } from '../core/interfaces/user-document';

export class UserService {
  constructor(private server: Server) {
    this.server.on('nickname', (user: UserDocument, data: any) => this.onNicknameChange(user, data));
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
}