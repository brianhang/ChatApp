import { Service, ServiceEvent } from './gateway/service';

export class UserService extends Service {
  onInit(): void {
  }

  @ServiceEvent()
  onTest(data: any) {
    setTimeout(() => {
      this.gateway.send('room', 'test', 'pong');
    }, 1000);
    console.log(`${data}`);
  }
}