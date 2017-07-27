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
var nicknames = {};

io.on('connection', (socket) => {
  socket.on('nickname', (name) => {
    name = name.toString().trim();

    if (name.length > 0 && nicknames[socket.id] != name) {
      var changeMessage;
      console.log(nicknames[socket.id])
      if (!nicknames[socket.id]) {
        changeMessage = name + " has joined the chatroom.";
        socket.emit('motd', 'Welcome to the chatroom, ' + name + '!');
      } else {
        changeMessage = nicknames[socket.id] + " changed their name to " + name + ".";
      }

      io.sockets.emit('message', changeMessage)
      nicknames[socket.id] = name;
    }
  });

  socket.on('getMessages', () => {
    socket.emit('messages', messages);
  });

  socket.on('message', (message) => {
    message = message.trim();

    if (message.length == 0 || !nicknames[socket.id]) {
      return;
    }

    const formattedMessage = nicknames[socket.id] + ": " + message;

    console.log(formattedMessage);
    messages.push(formattedMessage);
    socket.broadcast.emit('message', formattedMessage);
  });

  socket.on('disconnect', () => {
    nicknames[socket.id] = null;
  });
});