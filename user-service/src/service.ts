import { Service, ServiceEvent } from './gateway/service';

export class UserService extends Service {
  onInit(): void {
    console.log(123);
  }
}