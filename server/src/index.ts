import * as path from 'path';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { ChatServer } from './core/chat';

const router: express.Router = express.Router();
const app: express.Server = express();
const dist: string = '../../chat-app/dist';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, dist)));

app.get('/', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, dist + '/index.html'));
});

const port: number = 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

const chatServer: ChatServer = new ChatServer(server);
chatServer.start();

console.log('Server started on port ' + port);