const key = 'express.sid';
const secret = 'VpFNDCJJBFg2MfB5';

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

export const sessionConfig = {
  key: key,
  secret: secret,
  store: new MongoStore({
    url: 'mongodb://localhost/chatDb'
  }),
  resave: false,
  saveUninitialized: false
};

export const expressSession = session(sessionConfig);