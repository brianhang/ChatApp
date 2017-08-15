import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { NotifyService } from './notify/notify.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  protected loading: boolean;

  title = 'app';

  constructor(private authService: AuthenticationService, private router: Router, private notifyService: NotifyService) {
    this.loading = true;
  }

  public ngOnInit(): void {
    this.authService.getUser()
      .then(user => {
        if (user) {
          this.loading = false;
        } else {
          this.router.navigate(['/login']);
        }
      });
  }
}
