import { GatewayService } from '../service';

module.exports = function(service: GatewayService): void {
  service.on('roomAdd', (userId: string, data: any) => {
    service.gateway.send('room', 'add', userId, data);
  });
}