import { messages } from '../db/messageDb.js';

// Add a message to a room
export function addMessage(roomName, message) {
  if (!messages.has(roomName)) {
    messages.set(roomName, []);
  }
  messages.get(roomName).push(message);
}

// Get all messages for a room
export function getMessages(roomName) {
  return messages.get(roomName) || [];
}
