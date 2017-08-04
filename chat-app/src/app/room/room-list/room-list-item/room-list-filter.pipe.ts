import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../../chat/models/user';

@Pipe({
  name: 'roomEquals'
})
export class RoomPipe implements PipeTransform {
  transform(users: User[], roomId: string): any {
    return users.filter(user => { console.log(user); return user.room && user.room.id === roomId });
  }
}
