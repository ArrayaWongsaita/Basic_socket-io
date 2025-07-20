import { getConnectedUser } from '../shared/services/userService.js';

export default function BasicController(io, socket) {
  // Learn Page example
  // console.log("user", user)
  socket.on('hello', (data) => {
    const user = getConnectedUser(socket.user.email);
    console.log('👋 Hello event received from', socket.id, ':', data);
    socket.emit('hello', {
      message: `Hello back from server! You said: "${data}"`,
      user,
    });
  });
}
