import { Component } from '@angular/core';
import { ChatService } from './chat/chat.service';
import { Message } from './chat/message';
import { User } from './chat/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  public messages: Message[];

  public connected: boolean;

  private isTyping: boolean;

  public users: User[];

  constructor(private chatService: ChatService) {
    this.messages = [];
    this.users = [];
    this.connected = false;

    this.chatService.getState().subscribe((state) => {
      switch (state) {
        case 'connected':
          this.connected = true;
          break;
      }
    });

    this.chatService.onMessage().subscribe((message: Message) => {
      this.messages.push(message);
    });

    this.chatService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      console.log(this.users);
    });
  }

  onNicknameEnter(nickname: string) {
    this.chatService.join(nickname);
  }

  onChatEnter(message: string) {
    this.chatService.send(message);
  }

  onTypingUpdate(isTyping: boolean) {
    if (this.isTyping !== isTyping) {
      this.isTyping = isTyping;
      this.chatService.setTyping(isTyping);
    }
  }

  onChatTextChange(text: string) {
    this.onTypingUpdate(text.length > 0);
  }
}
