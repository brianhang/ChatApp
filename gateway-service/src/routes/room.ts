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

  service.on('roomEdit', (userId: string, data: any) => {
    service.gateway.send('room', 'edit', userId, data);
  });

  service.on('roomBans', (userId: string, data: any) => {
    service.gateway.send('room', 'bans', userId, data);
  });

  service.on('roomOwnerBan', (userId: string, data: any) => {
    service.gateway.send('room', 'ban', userId, data);
  });

  service.on('roomOwnerKick', (userId: string, data: any) => {
    service.gateway.send('room', 'kick', userId, data);
  });
}