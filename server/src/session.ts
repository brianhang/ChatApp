const expressSession = require('express-session');

export default expressSession({
  secret: 'VpFNDCJJBFg2MfB5',
  resave: false,
  saveUninitialized: false
});