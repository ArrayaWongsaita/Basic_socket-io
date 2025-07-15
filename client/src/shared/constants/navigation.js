import { PRIVATE_ROUTES, PUBLIC_ROUTES } from './router';

export const navBarList = [
  { name: 'Home', path: PUBLIC_ROUTES.HOME },
  { name: 'About', path: PUBLIC_ROUTES.ABOUT },
  { name: 'Broadcast', path: PRIVATE_ROUTES.BROADCAST },
  { name: 'Counter', path: PRIVATE_ROUTES.COUNTER },
  { name: 'Chat', path: PRIVATE_ROUTES.CHAT },
];
