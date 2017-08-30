import { Service, ServiceEvent } from './gateway/service';

export class UserService extends Service {
  onInit(): void {
  }

  @ServiceEvent()
  onPing() {
    console.log('Ping');
    setTimeout(() => this.gateway.send('room', 'ping', undefined), 1000);
  }
}