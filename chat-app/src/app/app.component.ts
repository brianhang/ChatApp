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

  constructor(private chatService: ChatService) {
    this.messages = [];

    chatService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });

    chatService.loadMessages();
  }

  onEnter(message: string) {
    this.chatService.sendMessage(message);
  }
}
