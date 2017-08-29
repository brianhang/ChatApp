import { Service, ServiceEvent } from './gateway/service';

export class UserService extends Service {
  onInit(): void {
    this.gateway.send('user', 'test', 123);
  }

  @ServiceEvent()
  onTest(data: any) {
    console.log(`[x] ${data}`);
  }
}