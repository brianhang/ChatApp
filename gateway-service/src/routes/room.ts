import { GatewayService } from '../service';

module.exports = function(service: GatewayService): void {
  service.gateway.on('roomAddResult', (userId: string, data: any) => {
    console.log(`${userId} <- ${JSON.stringify(data)}`);
  });

  service.on('roomAdd', (userId: string, data: any) => {
    console.log(`${userId} -> ${JSON.stringify(data)}`);
    service.gateway.send('room', 'add', userId, data);
  });
}