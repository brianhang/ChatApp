import { User } from './models/user';

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

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
      
      const token = data[1];

      jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({
            message: err.message
          });
        }

        res.status(200).json(decoded);
      });
    })
    .post('/register', (req: any, res: any) => {
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
        })
      }

      const user = new User({
        username: username,
        nickname: username,
        password: password
      });

      user.save((err) => {
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

        generateTokenResponse(user, res, 201);
      });
    })
    .post('/login', (req: any, res: any) => {
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
        })
      }

      User.findOne({ username: req.body.username }, (err, user) => {
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

        (<any>user).comparePassword(password)
          .then((success: boolean) => {
            if (success) {
              generateTokenResponse(user, res);
            } else {
              res.status(401).json({
                message: 'auth failed'
              })
            }
          })
          .catch((err: any) => {
            res.status(500).json({
              message: err.toString()
            });
          });
      })
    });
};