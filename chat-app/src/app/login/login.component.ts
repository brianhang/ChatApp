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
  protected form: FormGroup;

  protected busy: boolean;

  protected error: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) {
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });

    this.error = '';
    this.busy = false;
  }

  /**
   * Called when the user clicks on the login button.
   *
   * @param event Information about the click event.
   */
  protected onLogin(event): void {
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
        this.router.navigate(['/chat']);
      })
      .catch(error => {
        this.busy = false;
        this.error = 'You have provided an invalid username or password.';
      });
  }
}
