import { Component, OnInit, Input } from '@angular/core';
import { Message } from './models/message';

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
}
