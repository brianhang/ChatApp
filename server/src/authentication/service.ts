import { Server as ExpressServer } from 'express';
import { Users } from '../core/models/users';
import { UserDocument } from '../core/interfaces/user-document';

const passport = require('passport');

/**
 * The AuthenticationService sets up user authentication for the User class
 * and sets up routes so users can authenticate themselves.
 */
export class AuthenticationService {
  /**
   * Constructor which sets up the routes for handling user authentication.
   * 
   * @param app The express server to add routes to.
   */
  constructor(private app: ExpressServer) {
    // Set up the Passport authentication methods.
    require('./passport');

    // Add the user authentication routes.
    app.get('/auth', this.get);
    app.post('/auth/login', passport.authenticate('local'), this.login);
    app.post('/auth/signup', this.register);
    app.post('/auth/logout', this.logout);
  }

  /**
   * Returns information about the user if the user is logged in.
   * 
   * @param req The request from the user.
   * @param res The response to the user.
   */
  private get(req: any, res: any): void {
    let user = req.user;

    // Convert to an explicit null if the user is not logged in.
    if (user === undefined) {
      user = null;
    }

    res.json(user);
  }

  /**
   * Logs the user in and displays the user's information after doing so.
   * 
   * @param req The request from the user.
   * @param res The response to the user.
   */
  private login(req: any, res: any): void {
    res.status(200).json(req.user)
  }

  /**
   * Allows the user to sign up for an account on the chat server. This will
   * take the requested account details and create a user account with them.
   * 
   * @param req The request from the user.
   * @param res The response to the user.
   */
  private register(req: any, res: any): void {
    const username = req.body.username;
    const password = req.body.password;

    // Start the registration process.
    (<any>Users).register(
      // Create a new user instance.
      new Users({ username: username, nickname: username }),

      // Use the password given by the user.
      password,

      // Send details about the user back after registering the user.
      (err: any, user: UserDocument) => {
        // Send the error if registering failed.
        if (err) {
          res.status(400).json({ user: user, message: err.message });

          return;
        }

        // Otherwise, get the account and pass it back.
        passport.authenticate('local')(req, res, () => {
          console.log(req.user)
          res.status(201).json({ user: req.user, message: 'success' });
        });
      }
    );
  }

  /**
   * Logs the user out.
   * 
   * @param req The request from the user.
   * @param res The response to the user.
   */
  private logout(req: any, res: any): void {
    req.logout();
    res.sendStatus(200);
  }
}