import * as amqp from 'amqplib/callback_api';

const queue = 'user';

amqp.connect('amqp://rabbitmq', (err, conn) => {
  if (err) {
    console.error(err);

    return;
  }

  conn.createChannel((err, channel) => {
    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, new Buffer('Hello world!'));
  });
});