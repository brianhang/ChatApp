import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
export class RoomComponent implements AfterViewChecked {
  protected messages: Message[];
  @ViewChild('messageList') content: ElementRef;

  constructor(private chatService: ChatService, private messageService: MessageService) {
    this.messages = this.messageService.messages;
    this.messageService.messageAdded.subscribe((message) => {
      this.messages = this.messageService.messages.slice()
      this.scrollToBottom();
    });
    this.scrollToBottom();
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

  private scrollToBottom(): void {
    if (this.content) {
      this.content.nativeElement.scrollToBottom();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
}
