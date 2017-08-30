import { Service, ServiceEvent } from './gateway/service';
const expressJwt = require('express-jwt');

export class GatewayService extends Service {
  onInit(): void {
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGO_DB, {
      keepAlive: true,
      reconnectTries: 100,
      useMongoClient: true
    });

    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    require('./routes')(app);

    app.listen(process.env.PORT || 80, () => {
      console.log('Gateway API started...');
    });
  }
}