import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from './models/user';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/**
 * The AuthenticateService handles signing up and signing in to the chat server.
 */
@Injectable()
export class AuthenticationService {
  private _user: User | undefined;

  /**
   * Empty constructor that sets up the HTTP client.
   *
   * @param http HTTP client to send and get credentials with.
   */
  constructor(private http: Http) { }

  /**
   * Attempts to log in as the user with the given credentials.
   *
   * @param username The username to log in with.
   * @param password The password that corresponds to the username.
   * @return A promise that contains the user we logged in as.
   */
  public login(username: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const credentials = {
        username: username,
        password: password
      };

      // Log in with the given credentials.
      this.http.post('/auth/login', credentials)
        .map((res: Response) => res.json())
        .subscribe(
          (user: User) => {
            // Resolve if we got a user back (now logged in), reject otherwise.
            if (user) {
              this._user = user;
              resolve(user);
            } else {
              reject('You have provided an invalid username or password.');
            }
          },
          (error) => reject(error)
        );
    });
  }

  /**
   * Signs up for a new account with the given credentials. After, the user
   * will be signed in to the new account.
   *
   * @param username The desired username.
   * @param password The desired password.
   * @param nickname The desired nickname. By default it is the username.
   * @return A promise that contains a user the client signed up as.
   */
  public signUp(username: string, password: string, nickname?: string): Promise<User> {
    // Default the nickname to the username.
    if (!nickname) {
      nickname = username;
    }

    return new Promise((resolve, reject) => {
      const signUpData = {
        username: username,
        password: password,
        nickname: nickname
      };

      // Send the credentials to the server.
      this.http.post('/auth/signup', signUpData)
        .map((res: Response) => res.json())
        .subscribe(
          (data) => {
            // Sign in if we have the account and resolve. Otherwise, reject with
            // the error message.
            console.log(data);
            if (data.message === 'success' && data.user) {
              this._user = data.user;
              resolve(data.user);
            } else {
              reject(data.message);
            }
          },
          (error) => {
            console.log(error)
            if (error.error && error.error.message) {
              reject(error.error.message);
            } else {
              reject(error.toString());
            }
          }
        );
    })
  }

  /**
   * Retrieves the user that the client is logged in as. If the user is not
   * logged in, then the user retrieved will be null.
   *
   * @return A promise containing the user the client is logged in as.
   */
  public getUser(): Promise<(User | null)> {
    return new Promise((resolve, reject) => {
      this.http.get('/auth')
        .map(res => res.json())
        .subscribe(
          (user: User | null) => {
            resolve(user);
          },
          error => reject(error)
        );
    });
  }

  /**
   * Logs the user out.
   */
  public logout(): void {
    this._user = undefined;
    this.http.post('/auth/logout', { message: 'bye' })
      .subscribe(() => window.location.assign('/login'));
  }
}
