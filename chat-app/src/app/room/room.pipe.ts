import { Pipe, PipeTransform } from '@angular/core';
import { Message } from 'app/message/models/message';

@Pipe({
  name: 'room'
})
export class RoomPipe implements PipeTransform {
  transform(messages: Message[], roomId: string): any {
    return messages.filter(message => {
      return message.room.id === roomId
    });
  }
}
