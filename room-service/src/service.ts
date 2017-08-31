import { Service, ServiceEvent } from './gateway/service';

export class RoomService extends Service {
  onInit(): void {
  }

  @ServiceEvent()
  public onAdd(userId: string, data: any): void {
    console.log('OKAY')
    console.log(data)
    this.gateway.send('gateway', 'broadcast', 'roomData', data);
  }
}