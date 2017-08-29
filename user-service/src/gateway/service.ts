import { Gateway } from "./gateway";

/**
 * The ServiceEvent decorator sets up event listeners for service classes.
 */
export function ServiceEvent(nameOverride?: string): any {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    // Get a good name for the event.
    let event: string;

    if (nameOverride) {
      event = nameOverride;
    } else {
      const eventPattern = /on([\w_]+)/;
      const match = key.match(eventPattern);

      if (!match || match.length < 2) {
        return;
      }

      event = match[1];
      event = event[0].toLowerCase() + event.substring(1);
    }

    // Add it to the list of listeners to set up during runtime.
    target._listeners = target.listeners || new Map<string, string>();
    target._listeners.set(event, key);
  }
}

/**
 * The Service is a base service that is connected to a gateway. This adds
 * some helper things for setting up services.
 */
export abstract class Service {
  private _listeners: Map<string, string>;

  /**
   * A constructor that sets up the messaging gateway.
   * 
   * @param gateway The gateway to use for messaging.
   */
  constructor(protected gateway: Gateway) {
    if (!this._listeners) {
      return;
    }

    this._listeners.forEach((key, event) => {
      this.gateway.on(event, (data: any) => {
        (<any>this)[key](data);
      });
    });
  }

  /**
   * Connects to the gateway then initializes the service.
   */
  public start(): void {
    this.gateway.connect(this.getServiceName())
      .then(() => this.onInit());
  }

  /**
   * Called after the service has been started and is ready to be used.
   */
  protected abstract onInit(): void;

  /**
   * Helper method to get a nice name for the service.
   */
  private getServiceName(): string {
    const servicePattern = /([\w_]+)Service/;

    return this.constructor.name.match(servicePattern)![1].toLowerCase();
  }
}