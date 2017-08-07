import { Component } from '@angular/core';
import { ChatService } from './chat/chat.service';
import { Message } from './message/models/message';
import { User } from './chat/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
}
