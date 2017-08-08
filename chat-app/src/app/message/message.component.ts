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
  @Input() public nickname: string;

  // The contents of the message.
  @Input() public message: string;

  // The UNIX timestamp for when the message was created.
  @Input() public time: number;
}
