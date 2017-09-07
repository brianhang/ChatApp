import { MessageService } from './service';
import { AmqpGateway } from './gateway/amqp-gateway';

const gateway = new AmqpGateway(process.env.MESSAGE_QUEUE || '');
const service = new MessageService(gateway);
service.start();
