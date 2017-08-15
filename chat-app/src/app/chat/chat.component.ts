import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  protected loading: boolean;

  title = 'app';

  constructor(private authService: AuthenticationService, private router: Router) {
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
