import * as path from 'path';

require('dotenv').config({
  path: path.join(__dirname, '../app.env')
});

import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as socket from 'socket.io';

import { AuthenticationService } from './authentication/service';
import { ChatServer } from './core/chat';
import { sessionConfig, expressSession } from './session';

const cookieParser = require('cookie-parser');
const cookieParserMiddleware = cookieParser();
const passport = require('passport');
const passportSocketIo = require('passport.socketio');

// Set up the express server.
const router: express.Router = express.Router();
const app: express.Server = express();
const dist: string = '../' + process.env.DIST_DIR || '../dist/';

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParserMiddleware);
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
app.use('/static', express.static(path.join(__dirname, '../' + process.env.STATIC_DIR)));
app.use(express.static(path.join(__dirname, dist)));

// Start up the chat server
const port: number = 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

// Set up the server socket.
const io = socket(server);
const passportSession = Object.assign(sessionConfig, {
  cookieParser: cookieParser
});

io.use((socket, next) => cookieParserMiddleware(socket.request, {}, next));
io.use(passportSocketIo.authorize(passportSession));

// Create the actual chat server.
const chatServer: ChatServer = new ChatServer(io);
chatServer.setup()
  .then(() => {
    chatServer.start();
    console.log('Server started on port ' + port);
  })
  .catch(err => console.error(err));

// Set up the authentication service.
const authentication = new AuthenticationService(app);

app.get('/*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, dist + '/index.html'));
});

process.on('SIGINT', () => {
  io.close();
  server.close();
  process.exit();
});
