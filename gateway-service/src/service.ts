import { Service, ServiceEvent } from './gateway/service';
import * as socket from 'socket.io';
const expressJwt = require('express-jwt');

export class GatewayService extends Service {
  private io: SocketIO.Server;

  onInit(): void {
    // Connect to the authentication database.
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGO_DB, {
      keepAlive: true,
      reconnectTries: 100,
      useMongoClient: true
    });

    // Set up the REST API end points.
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    require('./routes/authentication')(app);

    // Set up the server socket.
    const httpServer = require('http').createServer(app);
    this.io = socket(httpServer);
    
    this.io.on('connection', (socket) => {
      console.log('Yay!');
    })
    
    httpServer.listen(80);
  }
}