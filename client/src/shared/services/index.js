// Export all services
export { authService } from './authService';
export { userService } from './userService';
export { roomService } from './roomService';
export { messageService } from './messageService';
export { socketService } from './socketService';

// Import services for default export
import { authService } from './authService';
import { userService } from './userService';
import { roomService } from './roomService';
import { messageService } from './messageService';
import { socketService } from './socketService';

// Default export with all services
export default {
  auth: authService,
  user: userService,
  room: roomService,
  message: messageService,
  socket: socketService,
};
