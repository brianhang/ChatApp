import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../message/models/message';

/**
 * Filters chat messages so only messages with the matching room ID remain.
 */
@Pipe({
  name: 'room'
})
export class RoomPipe implements PipeTransform {
  transform(messages: Message[], roomId: string): any {
    return messages.filter(message => {
      return message.room === roomId;
    });
  }
}
