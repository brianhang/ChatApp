const key = 'express.sid';
const secret = 'VpFNDCJJBFg2MfB5';

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const YEAR = 1000 * 60 * 60 * 24 * 30 * 12;

export const sessionConfig = {
  key: key,
  secret: secret,
  store: new MongoStore({
    url: 'mongodb://localhost/chatDb'
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: YEAR
  }
};

export const expressSession = session(sessionConfig);