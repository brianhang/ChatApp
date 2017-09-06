import { Gateway } from './gateway';

/**
 * Helper function to get the lowerCamelCased word after "on".
 *
 * @param key The string to get an event name from.
 */
function getEventName(key: string): string {
  const eventPattern = /on([\w_]+)/;
  const match = key.match(eventPattern);

  if (!match || match.length < 2) {
    return '';
  }

  let event = match[1];
  event = event[0].toLowerCase() + event.substring(1);

  return event;
}

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
      event = getEventName(key);

      if (event === '') {
        return;
      }
    }

    // Add it to the list of listeners to set up during runtime.
    target._listeners = target._listeners || new Map<string, string>();
    target._listeners.set(event, key);
  };
};

/**
 * The ServiceEvent decorator subscribes this service to a particular
 * pub/sub style event.
 */
export function ServiceSubscription(nameOverride?: string): any {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    // Get a good name for the event.
    let event: string;

    if (nameOverride) {
      event = nameOverride;
    } else {
      event = getEventName(key);

      if (event === '') {
        return;
      }
    }

    // Add it to the list of listeners to set up during runtime.
    target._subscriptions = target._subscriptions || new Map<string, string>();
    target._subscriptions.set(event, key);
  };
};

/**
 * The Service is a base service that is connected to a gateway. This adds
 * some helper things for setting up services.
 */
export abstract class Service {
  private _listeners: Map<string, string>;
  private _subscriptions: Map<string, string>;

  /**
   * A constructor that sets up the messaging gateway.
   *
   * @param gateway The gateway to use for messaging.
   */
  constructor(public readonly gateway: Gateway) {
    if (this._listeners) {
      this._listeners.forEach((key, event) => {
        this.gateway.on(event, (<any>this)[key].bind(this));
      });
    }

    if (this._subscriptions) {
      this._subscriptions.forEach((key, event) => {
        this.gateway.subscribe(event, (<any>this)[key].bind(this));
      });
    }
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
    const serviceMatch = this.constructor.name.match(servicePattern);

    if (!serviceMatch) {
      throw new Error(`${this.constructor.name} is not a valid service name`);
    }

    return serviceMatch[1].toLowerCase();
  }
};
