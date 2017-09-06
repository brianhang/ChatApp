import { MessageService } from './service';
import { AmqpGateway } from './gateway/amqp-gateway';

const gateway = new AmqpGateway('amqp://rabbitmq');
const service = new MessageService(gateway);
service.start();
