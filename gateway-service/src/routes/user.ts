import { GatewayService } from '../service';

module.exports = function(service: GatewayService): void {
  service.on('nickname', (userId: string, value: string) => {
    service.gateway.send('user', 'nicknameChange', userId, value);
  });
}
