import { Component } from '@angular/core';
import { ChatService } from './chat/chat.service';
import { Message } from './chat/message';
import { User } from './chat/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public messages: Message[];

  public connected: boolean;

  constructor(private chatService: ChatService) {
    this.messages = [];
    this.connected = false;

    this.chatService.getState().subscribe((state) => {
      switch (state) {
        case 'connected':
          this.connected = true;
          break;
      }
    });

    this.chatService.onMessage().subscribe((message) => {
      this.messages.push(message);
    })
  }

  onNicknameEnter(nickname: string) {
    this.chatService.join(nickname);
  }

  onChatEnter(message: string) {
    this.chatService.send(message);
  }
}
