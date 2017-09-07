import { MessageDocument } from './interfaces/message-document';

export function getMessagePayload(message: MessageDocument): Object {
  return {
    _id: message._id,
    user: message.user,
    nickname: message.nickname,
    content: message.content,
    room: message.room,
    icon: message.icon,
    time: message.time.toUTCString()
  };
}
