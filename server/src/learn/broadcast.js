import { rooms } from '../shared/db/socketDb.js';
import { getConnectedUser } from '../shared/services/userService.js';

export default function broadcastController(io, socket) {
  // ส่งถึงทุก client (รวม sender)
  socket.on('send-broadcast-all', (data) => {
    io.emit('broadcast-alert', {
      type: 'all',
      sender: socket.user?.email,
      ...data,
    });
  });

  // ส่งถึงทุก client ยกเว้น sender
  socket.on('send-broadcast-others', (data) => {
    socket.broadcast.emit('broadcast-alert', {
      type: 'others',
      sender: socket.user?.email,
      ...data,
    });
  });

  // ส่งถึงตัวเองเท่านั้น
  socket.on('send-broadcast-self', (data) => {
    console.log('Broadcasting to self:', data);
    socket.emit('broadcast-alert', {
      type: 'self',
      sender: socket.user?.email,
      ...data,
    });
  });

  // ส่งถึงทุก client ใน room
  socket.on('send-broadcast-to', ({ to, ...data }) => {
    io.to(to).emit('broadcast-alert', {
      type: 'room',
      sender: socket.user?.email,
      ...data,
    });
    // io.to([to, socket.id]).emit('broadcast-alert', {
    //   type: 'room',
    //   sender: socket.user?.email,
    //   ...data,
    // });
    // io.to(roomName).emit('new-message', {
    //   type: 'room',
    //   roomName: roomName,
    //   sender: socket.user?.email,
    //   ...data,
    // });
  });
}
