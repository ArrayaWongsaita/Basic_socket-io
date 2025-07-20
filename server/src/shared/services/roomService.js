// Service for room-related operations
import { rooms } from '../db/socketDb.js';

/**
 * Remove a user from all rooms and notify room members.
 * @param {object} socket - The socket instance
 * @param {object} user - The user object (must have .rooms as Set)
 */
export function removeUserFromAllRooms(socket, user) {
  if (!user || !user.rooms) return;
  user.rooms.forEach((roomName) => {
    if (rooms.has(roomName)) {
      rooms.get(roomName).delete(socket.user.email);
      if (rooms.get(roomName).size === 0) {
        rooms.delete(roomName);
      }
      // Notify room members
      socket.to(roomName).emit('user_left_room', {
        socketId: socket.id,
        roomName: roomName,
        timestamp: new Date().toISOString(),
      });
    }
  });
}
