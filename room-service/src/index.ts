import { RoomService } from './service';
import { AmqpGateway } from './gateway/amqp-gateway';

const gateway = new AmqpGateway('amqp://rabbitmq');
const service = new RoomService(gateway);
service.start();