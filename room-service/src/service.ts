import { Service, ServiceEvent } from './gateway/service';

export class RoomService extends Service {
  onInit(): void {
    this.gateway.send('user', 'test', 'ping');
  }

  @ServiceEvent()
  onTest(data: any) {
    setTimeout(() => {
      this.gateway.send('user', 'test', 'ping');
    }, 1000);
    console.log(`${data}`);
  }
}