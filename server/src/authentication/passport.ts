import { Users } from "../core/models/users";

const passport = require('passport');

// Set up password to work with the Users modle.
passport.use((<any>Users).createStrategy());
passport.serializeUser((<any>Users).serializeUser());
passport.deserializeUser((<any>Users).deserializeUser());