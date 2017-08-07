import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MessageService } from 'app/message/message.service';
import { Message } from 'app/message/models/message';
import { RoomPipe } from './room.pipe';
import { ChatService } from 'app/chat/chat.service';
import { User } from 'app/chat/models/user';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  protected messages: Message[];

  constructor(private chatService: ChatService, private messageService: MessageService) {
    this.messages = this.messageService.messages;
    this.messageService.messageAdded.subscribe((message) => this.messages = this.messageService.messages.slice());
  }

  protected onMessageEntered(content: string): void {
    this.messageService.send(content);
  }

  protected get user(): User {
    return this.chatService.user;
  }

  protected onMessageElementCreated(event): void {
    console.log(event)
  }
}
