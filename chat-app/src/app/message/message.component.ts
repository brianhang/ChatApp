import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../chat/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() public nickname: string;
  @Input() public message: string;
}
