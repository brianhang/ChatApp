/**
 * The Gateway interface sets up a way to follow the publish-subscribe pattern
 * with some external service.
 */
export interface Gateway {
  /**
   * Connects to the external service for handling messages.
   *
   * @param exchange The exchang that we should connect to.
   * @return A promise that is called after a connection to the gateway has
   *         been established.
   */
  connect(exchange: string): Promise<void>;

  /**
   * Sends an event to a specific service.
   *
   * @param service The name of the service to send to.
   * @param event The name of the event to send.
   * @param data Any data to send along with the event.
   */
  send(service: string, event: string, ...data: any[]): Gateway;

  /**
   * Listens for an event that is only sent to this service.
   *
   * @param event The name of the event to listen for
   * @param callback What to do when the event is received.
   */
  on(event: string, callback: Function): Gateway;

  /**
   * Publishes an event to any service that is subscribed to this event.
   *
   * @param event The name of the event to publish.
   * @param data The data to send along with the event.
   */
  publish(event: string, ...data: any[]): Gateway;

  /**
   * Subscribes to an event that could have originated from any service.
   *
   * @param event The name of the event to subscribe to.
   * @param callback What to do when the event is received.
   */
  subscribe(event: string, callback: Function): Gateway;
}
