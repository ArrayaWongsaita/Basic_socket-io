import { connectedUsers } from '../db/socketDb.js';

export function addConnectedUser(email, userObj) {
  connectedUsers.set(email, userObj);
}

export function getConnectedUser(email) {
  return connectedUsers.get(email);
}

export function deleteConnectedUser(email) {
  connectedUsers.delete(email);
}

export function getConnectedUsersCount() {
  return connectedUsers.size;
}
