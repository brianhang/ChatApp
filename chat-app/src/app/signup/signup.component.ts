import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  // The sign up form.
  public form: FormGroup;

  // The error that will be displayed to the user.
  public error: string;

  // Whether or not the form should not be interacted with.
  public busy: boolean;

  /**
   * Constructor which sets up the form.
   *
   * @param formBuilder Builder for the sign up form.
   * @param authService Service for signing up the user.
   */
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) {
    this.error = '';
    this.busy = false;

    this.form = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      confirm: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
  }

  /**
   * Called when the user presses on the sign up button.
   *
   * @param event Information about the click event.
   */
  onSubmit(event): void {
    const username = this.form.controls.username.value;
    const password = this.form.controls.password.value;
    const confirm = this.form.controls.confirm.value;

    // Make sure the form data is valid.
    if (!this.form.valid) {
      this.error = 'Please fix the errors on the form.';

      return;
    }

    // Make sure the password confirmation matches.
    if (password !== confirm) {
      this.error = 'The password confirmation does not match the password.';

      return;
    }

    this.busy = true;

    // Send the desired credentials to the server.
    this.authService.signUp(username, password, username)
      .then(user => {
        window.location.assign('/chat');
      })
      .catch(error => {
        this.busy = false;
        this.error = error;
      });
  }
}
