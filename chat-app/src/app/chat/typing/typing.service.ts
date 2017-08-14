import { Injectable } from '@angular/core';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class TypingService {
  constructor(private chatService: ChatService) {
    this.chatService.on('typing', (data: any) => this.onUserTypingStateChanged(data));
  }

  /**
   * Sets whether or not the local user is typing.
   *
   * @param isTyping True if the local user is typing, false otherwise.
   */
  public setTyping(isTyping: boolean): void {
    if (this.chatService.user.isTyping !== isTyping) {
      this.chatService.user.isTyping = isTyping;
      this.chatService.emit('typing', isTyping);
    }
  }

  /**
   * Replicates the typing state of another user.
   *
   * @param data Data about the typing state of another user.
   */
  private onUserTypingStateChanged(data: any): void {
    const user = this.chatService.getUserById(data.userId);
    const isTyping = data.isTyping;

    user.isTyping = isTyping;
  }
}
