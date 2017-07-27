import { Component } from '@angular/core';
import { ChatService } from './chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public messages: string[]
  
  private ready: boolean;

  constructor(private chatService: ChatService) {
    this.messages = [];
    this.ready = false;

    chatService.getMotd().subscribe((motd: string) => {
      this.messages.push("Message of the Day:");
      this.messages.push(motd);

      this.ready = true;
    });

    chatService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });

    chatService.loadMessages();
  }

  onEnter(message: string) {
    this.chatService.sendMessage(message);
  }

  onNicknameEnter(nickname: string) {
    this.chatService.setNickname(nickname);
  }
}
