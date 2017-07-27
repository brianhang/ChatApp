const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const express = require('express');
const router = express.Router();

const app = express();

const dist = 'chat-app/dist';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, dist)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, dist + '/index.html'));
});

const port = 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

console.log('Server started on port ' + port);

var io = require('socket.io')(server);
var messages = [];

io.on('connection', (socket) => {
  socket.on('getMessages', () => {
    socket.emit('messages', messages);
  });

  socket.on('message', (message) => {
    console.log(message);
    messages.push(message);
    io.sockets.emit('message', message);
  });
});