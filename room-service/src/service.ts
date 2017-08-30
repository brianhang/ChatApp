import { Service, ServiceEvent } from './gateway/service';

export class RoomService extends Service {
  onInit(): void {
    this.gateway.send('user', 'ping');
  }

  @ServiceEvent()
  onPing() {
    console.log('Pong');
    setTimeout(() => this.gateway.send('user', 'ping', undefined), 1000);
  }
}