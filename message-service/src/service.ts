import { Service, ServiceEvent } from './gateway/service';

export class MessageService extends Service {
  onInit(): void {
    this.gateway.send('message', 'test', 213);
  }

  @ServiceEvent()
  onTest(data: any) {
    console.log('woo');
  }
}