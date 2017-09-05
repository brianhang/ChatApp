import { GatewayService } from '../service';

module.exports = function(service: GatewayService): void {
  service.on('roomAdd', (userId: string, data: any) => {
    service.gateway.send('room', 'add', userId, data);
  });

  service.on('roomJoin', (userId: string, data: any) => {
    const roomId = (data.roomId || '').toString();
    const password = (data.password || '').toString();

    service.gateway.send('room', 'roomJoin', userId, roomId, password);
  });

  service.on('roomLeave', (userId: string, data: any) => {
    service.gateway.send('room', 'roomLeave', userId);
  });
}