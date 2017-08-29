import { Service, ServiceEvent } from './gateway/service';

export class MessageService extends Service {
  onInit(): void {
    this.gateway.send('message', 'echo', 'Hello world!');
  }

  @ServiceEvent()
  onEcho(data: any) {
    console.log(`[x] ${data}`);
  }
}