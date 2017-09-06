import { GatewayService } from '../service';
import { Users } from '../models/user';

module.exports = function(service: GatewayService): void {
  service.on('msg', (userId: string, data: any) => {
    service.gateway.send('message', 'send', userId, data);
  });

  service.on('typing', (userId: string, data: any) => {
    service.gateway.send('message', 'typing', userId, data);
  });

  service.on('msgEdit', (userId: string, data: any) => {
    service.gateway.send('message', 'edit', userId, data);
  });

  service.on('msgDelete', (userId: string, data: any) => {
    service.gateway.send('message', 'delete', userId, data);
  });

  service.on('msgRequestOlder', (userId: string, data: any) => {
    service.gateway.send('message', 'requestOlder', userId, data);
  });
}
