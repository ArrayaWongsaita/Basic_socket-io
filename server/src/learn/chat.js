import {
  CHAT_EVENTS,
  CHAT_ACTIONS,
} from '../shared/constants/socket.constant.js';
import { addMessage, getMessages } from '../shared/services/messageService.js';
import { getConnectedUser } from '../shared/services/userService.js';

export default function chatController(io, socket) {
  socket.on(CHAT_ACTIONS.SEND_MESSAGE, (data) => {
    console.log('Sending message:', data);
    const { message, roomName } = data;
    if (!message || !roomName) {
      socket.emit(CHAT_EVENTS.CHAT_ERROR, {
        error: 'Message or room is missing',
      });
      return;
    }

    const messageData = {
      message,
      sender: socket.user?.email,
      timestamp: new Date().toISOString(),
    };

    addMessage(roomName, messageData);

    io.to(roomName).emit(CHAT_EVENTS.NEW_MESSAGE, messageData);

    socket.emit(CHAT_EVENTS.CHAT_STATUS, {
      status: 'Message sent successfully',
    });
  });

  socket.on(CHAT_ACTIONS.JOIN_CHAT, ({ roomName }) => {
    const user = getConnectedUser(socket.user.email);
    if (!user) {
      socket.emit(CHAT_EVENTS.CHAT_ERROR, {
        error: 'User not found',
      });
      return;
    }
    const messages = getMessages(roomName);
    socket.join(roomName);
    socket.emit(CHAT_EVENTS.SYNC_MESSAGES, { messages });
    socket.emit(CHAT_EVENTS.CHAT_STATUS, {
      status: `Joined room: ${roomName}`,
    });
  });

  socket.on(CHAT_ACTIONS.LEAVE_CHAT, ({ roomName }) => {
    socket.leave(roomName);
    socket.emit(CHAT_EVENTS.CHAT_STATUS, {
      status: `Left room: ${roomName}`,
    });
  });
}
