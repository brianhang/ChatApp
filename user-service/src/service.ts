import { Service, ServiceEvent, ServiceSubscription } from './gateway/service';

export class UserService extends Service {
  public onInit(): void {
  }

  @ServiceEvent()
  public onPing() {
    console.log('Ping');
    setTimeout(() => this.gateway.send('room', 'ping', undefined), 1000);
  }

  @ServiceSubscription()
  public onUserConnected(userId: string): void {
    console.log(userId);
  }
}