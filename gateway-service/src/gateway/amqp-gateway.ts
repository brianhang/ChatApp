import { Gateway } from './gateway';
import * as amqp from 'amqplib/callback_api';

const GLOBAL_EXCHANGE = '_';

/**
 * The AmqpGateway class handles communication with a message queue that
 * follows the AMQP standards.
 */
export class AmqpGateway implements Gateway {
  // The channel to receive and send data.
  private channel: amqp.Channel;

  // The listeners that have been set up.
  private events: Map<string, Function>;
  private subscriptions: Map<string, Function>;

  // The exchange to use for messages.
  private exchange: string;

  /**
   * Constructor which sets which queue to send/receive messages from.
   *
   * @param queueUrl Where the queue is located.
   */
  constructor(private queueUrl: string) {
    this.events = new Map<string, Function>();
    this.subscriptions = new Map<string, Function>();
  }

  /**
   * Connects to the AMQP message queue set by the constructor.
   *
   * @param exchange The name of the exchange to bind to.
   * @param delay An optional delay for when to connect in milliseconds.
   * @return A promise that is called after the connection has been made.
   */
  public connect(exchange: string, delay: number = 0): Promise<void> {
    this.exchange = exchange;

    return new Promise<void>((resolve: Function, reject: Function) => {
      setTimeout(() => {
        amqp.connect(this.queueUrl, (err, connection) => {
          // Retry later if we could not connect this time.
          if (err) {
            const newDelay = delay + 500;

            console.log(`Failed to connect to message queue! ${err}`);
            console.log(`Trying again in ${newDelay / 1000} seconds...`);

            this.connect(exchange, newDelay)
              .then(() => resolve())
              .catch(connectErr => reject(connectErr));

            return;
          }

          // If we connected, store the channel.
          connection.createChannel((channelErr, channel) => {
            if (channelErr) {
              throw new Error(`Failed to create channel: ${err}`);
            }

            this.channel = channel;

            // Add all listeners to this channel.
            this.channel.assertExchange(this.exchange, 'direct');
            this.channel.assertExchange(GLOBAL_EXCHANGE, 'fanout');

            this.events.forEach((callback, event) => {
              this.addEventListener(this.exchange, event, callback);
            });

            this.subscriptions.forEach((callback, event) => {
              this.addEventListener(GLOBAL_EXCHANGE, event, callback);
            });

            // Indicate we are done setting up the gateway.
            resolve();
          });
        });
      }, delay);
    });
  }

  /**
   * Sends various data to the queue.
   *
   * @param event The name of the event to send.
   * @param data The data about the event.
   */
  public send(service: string, event: string, ...data: any[]): Gateway {
    const routingKey = `${service}.${event}`;

    // Only send if there is a channel to send to and data to send.
    if (this.channel) {
      const newData = JSON.stringify(data);
      this.channel.publish(service, routingKey, Buffer.from(newData));
    }

    return this;
  }

  /**
   * Sets the listener for a certain event.
   *
   * @param event The name of the event to listen for.
   * @param callback A function that will be called once the event is triggered.
   */
  public on(event: string, callback: Function): Gateway {
    this.events.set(event, callback);

    if (this.channel) {
      this.addEventListener(this.exchange, event, callback);
    }

    return this;
  }

  /**
   * Publishes an event to any service that is subscribed to this event.
   *
   * @param event The name of the event to publish.
   * @param data The data about the event.
   */
  publish(event: string, ...data: any[]): Gateway {
    const routingKey = `${GLOBAL_EXCHANGE}.${event}`;

    // Only send if there is a channel to send to and data to send.
    if (this.channel) {
      const newData = JSON.stringify(data);
      this.channel.publish(GLOBAL_EXCHANGE, routingKey, Buffer.from(newData));
    }

    return this;
  }

  /**
   * Subscribes to an event that could have originated from any service.
   *
   * @param event
   * @param callback
   */
  subscribe(event: string, callback: Function): Gateway {
    this.subscriptions.set(event, callback);

    if (this.channel) {
      this.addEventListener(GLOBAL_EXCHANGE, event, callback);
    }

    return this;
  }

  /**
   * A helper method to set up a callback for a certain event. An event is
   * really the result of routing keys in the message queue.
   *
   * @param queue The name of the event to listen for.
   * @param callback The function to call after the event we are listening for
   *                 has been triggered.
   */
  private addEventListener(exchange: string, event: string, callback: Function): void {
    const queue = `${this.exchange}.${event}`;

    // Set up a queue for messages that match this event.
    this.channel.assertQueue(queue, { durable: false }, (err: any, ok: any) => {
      if (err) {
        console.error(`Failed to set up listener for ${event}: ${err}`);

        return;
      }

      // Have the queue be a part of the exchange for our service.
      this.channel.bindQueue(queue, exchange, queue);

      // Fire the callback every time a message matching the event is received.
      this.channel.consume(queue, message => {
        if (!message) {
          return;
        }

        const routingKey = `${exchange}.${event}`;

        if (message.fields && message.fields.routingKey !== routingKey) {
          return;
        }

        // Convert the data from the message to JSON to pass to the callback.
        let data: any;

        try {
          data = JSON.parse(message.content.toString());
        } catch (ex) {
          data = undefined;
        }

        if (data) {
          callback(...data);
        } else {
          callback();
        }
      }, { noAck: true });
    });
  }
}
