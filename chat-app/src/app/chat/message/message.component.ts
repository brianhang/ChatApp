import { Component, OnInit, Input } from '@angular/core';
import { Message } from './models/message';
import { ChatService } from '../chat/chat.service';

/**
 * The MessageComponent represents a message that was sent to the chat server.
 */
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  // The name to show in the message.
  @Input() public message: Message;

  // Whether or not to show the message options (edit, delete, etc...).
  @Input() public showOptions: boolean;

  constructor(private chatService: ChatService) { }

  protected onClickDelete(event): void {
    this.chatService.emit('msgDelete', this.message._id);
  }

  protected onClickEdit(event): void {
    throw new Error('Not implemented');
  }
}
