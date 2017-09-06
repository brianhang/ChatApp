import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
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
      this.http.post('/gateway/login', credentials)
        .map((res: Response) => res.json())
        .subscribe(
          (data: any) => {
            // Resolve if we got a user back (now logged in), reject otherwise.
            if (data.message === 'success' && data.token) {
              localStorage.setItem('chat-app-jwt', data.token);
              resolve();
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
        password: password
      };

      // Send the credentials to the server.
      this.http.post('/gateway/register', signUpData)
        .map((res: Response) => res.json())
        .subscribe(
          (data) => {
            // Sign in if we have the account and resolve. Otherwise, reject with
            // the error message.
            if (data.message === 'success' && data.token) {
              localStorage.setItem('chat-app-jwt', data.token);
              resolve();
            } else {
              reject(data.message);
            }
          },
          (error) => {
            if (error.error && error.error.message) {
              reject(error.error.message);
            } else {
              reject(error.toString());
            }
          }
        );
    });
  }

  /**
   * Retrieves the user that the client is logged in as. If the user is not
   * logged in, then the user retrieved will be null.
   *
   * @return A promise containing the user the client is logged in as.
   */
  public getUser(): Promise<(User | null)> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('chat-app-jwt');

      if (!token || token.length === 0) {
        resolve(null);

        return;
      }

      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Authorization', `Bearer ${token}`);

      const options = new RequestOptions({ headers: headers });

      this.http.get('/gateway/user', options)
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
    localStorage.setItem('chat-app-jwt', '');
    window.location.assign('/login');
  }
}
