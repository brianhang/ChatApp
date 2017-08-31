import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { NotifyService } from './notify/notify.service';
import { ChatService } from './chat/chat.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public loading: boolean;

  title = 'app';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private notifyService: NotifyService,
    private chatService: ChatService
  ) {
    this.loading = true;
  }

  public ngOnInit(): void {
    this.authService.getUser()
      .then(user => {
        if (user) {
          this.chatService.connect()
            .then(() => this.loading = false)
            .catch(() => this.authService.logout());
        } else {
          this.router.navigate(['/login']);
        }
      });
  }

  public get disconnected(): boolean {
    return this.chatService.disconnected;
  }
}
