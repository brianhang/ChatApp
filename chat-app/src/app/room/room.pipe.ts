import { Pipe, PipeTransform } from '@angular/core';
import { Message } from 'app/message/models/message';

/**
 * Filters chat messages so only messages with the matching room ID remain.
 */
@Pipe({
  name: 'room'
})
export class RoomPipe implements PipeTransform {
  transform(messages: Message[], roomId: string): any {
    return messages.filter(message => message.room.id === roomId);
  }
}
