import { UserDocument } from '../interfaces/user-document';
import { Users } from '../models/user';

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

/**
 * A helper function to generate a JWT and to send it to the user.
 *
 * @param user The user that this token is for.
 * @param res The response object to send the token back.
 * @param status An optional HTTP response code to use for the response.
 */
function generateTokenResponse(user: any, res: any, status?: number) {
  const token = jwt.sign({
    userId: user._id
  }, secret, { expiresIn: '30d' });

  res.status(status || 200).json({
    message: 'success',
    token: token
  });
}

module.exports = function(app: any) {
  app
    .get('/user', (req: any, res: any) => {
      // Try to get the JWT token from the Authentication header.
      const authorization = req.get('Authorization');

      if (!authorization) {
        return res.status(400).json({
          message: 'missing header'
        });
      }

      const data = authorization.split(' ');

      if (data[0] !== 'Bearer') {
        return res.status(400).json({
          message: 'unexpected schema'
        });
      }

      if (data.length < 2) {
        return res.status(400).json({
          message: 'missing token'
        });
      }

      // Once we have the token, try to get the payload from it.
      const token = data[1];

      jwt.verify(token, secret, (err: any, decoded: any) => {
        // If an error occured while doing so, send the error.
        if (err) {
          return res.status(401).json({
            message: err.message
          });
        }

        // Otherwise, respond with the payload.
        res.status(200).json(decoded);
      });
    })
    .post('/register', (req: any, res: any) => {
      // Validate the desired username and password.
      const username = req.body.username;
      const password = req.body.password;

      if (!username || username.length < 1) {
        return res.status(400).json({
          message: 'invalid username'
        });
      }

      if (!password || password.length < 1) {
        return res.status(400).json({
          message: 'invalid password'
        });
      }

      // Create a new user instance with the given username and password.
      Users.create({
        username: username,
        nickname: username,
        password: password
      }, (err: any, user: UserDocument) => {
        if (err) {
          // Check if the username was already in use.
          if (err.code === 11000) {
            return res.status(403).json({
              message: 'username in use'
            });
          }

          return res.status(500).json({
            message: err.toString()
          });
        }

        // Once the user is saved, send the JWT token to authenticate as them.
        generateTokenResponse(user, res, 201);
      });
    })
    .post('/login', (req: any, res: any) => {
      // Validate the login details.
      const username: string = req.body.username;
      const password: string = req.body.password;

      if (!username || username.length < 1) {
        return res.status(400).json({
          message: 'invalid username'
        });
      }

      if (!password || password.length < 1) {
        return res.status(400).json({
          message: 'invalid password'
        });
      }

      // Try to find the user with the given username.
      Users.findOne({ username: req.body.username }, (err: any, user: UserDocument) => {
        // Send the error if the user could not be found.
        if (err) {
          return res.status(500).json({
            message: err.toString()
          });
        }

        if (!user) {
          return res.status(404).json({
            message: 'user not found'
          });
        }

        // Check the given password is the correct password for this user.
        (<any>user).comparePassword(password)
          .then((success: boolean) => {
            // If it is, then send the JWT token back to authenticate.
            if (success) {
              generateTokenResponse(user, res);
            } else {
              res.status(401).json({
                message: 'auth failed'
              })
            }
          })
          .catch((compareErr: any) => {
            res.status(500).json({
              message: compareErr.toString()
            });
          });
      });
    });
};
