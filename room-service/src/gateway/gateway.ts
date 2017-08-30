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
   * Publishes a message.
   */
  send(exchange: string, event: string, ...data: any[]): Gateway;

  /**
   * Subscribes to a particular message.
   */
  on(event: string, callback: Function): Gateway;
}