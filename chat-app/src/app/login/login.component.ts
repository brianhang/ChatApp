import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public form: FormGroup;

  public busy: boolean;

  public error: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });

    this.error = '';
    this.busy = false;

    if (localStorage.getItem('chat-app-jwt')) {
      this.onLoggedIn();
    }
  }

  /**
   * Called when the user clicks on the login button.
   *
   * @param event Information about the click event.
   */
  public onLogin(event): void {
    if (!this.form.valid) {
      this.error = 'Please enter a valid username and password.';

      return;
    }

    const username = this.form.controls.username.value;
    const password = this.form.controls.password.value;

    this.busy = true;
    this.error = '';

    this.authService.login(username, password)
      .then(user => {
        this.onLoggedIn();
      })
      .catch(error => {
        this.busy = false;
        this.error = 'You have provided an invalid username or password.';
      });
  }

  /**
   * Called after the user has been logged in.
   */
  private onLoggedIn(): void {
    this.router.navigate(['/chat']);
  }
}
