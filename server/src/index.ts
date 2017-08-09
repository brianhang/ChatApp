import * as path from 'path';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import { AuthenticationService } from './authentication/service';
import { ChatServer } from './core/chat';
import { default as session } from './session';

const passport = require('passport');


const router: express.Router = express.Router();
const app: express.Server = express();
const dist: string = '../../chat-app/dist';

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(require('cookie-parser')());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, dist)));

// Start up the chat server
const port: number = 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

const chatServer: ChatServer = new ChatServer(server);
chatServer.setup()
  .then(() => {
    chatServer.start();
    console.log('Server started on port ' + port);
  })
  .catch(err => console.error(err));

// Set up the authentication service
const authentication = new AuthenticationService(app);

app.get('/*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, dist + '/index.html'));
});