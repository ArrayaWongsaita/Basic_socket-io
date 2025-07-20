import { PRIVATE_ROUTES, PUBLIC_ROUTES } from './router';

export const navBarList = [
  { name: 'Home', path: PUBLIC_ROUTES.HOME },
  { name: 'About', path: PUBLIC_ROUTES.ABOUT },
  { name: 'Learn', path: PUBLIC_ROUTES.LEARN },
  { name: 'Broadcast', path: PRIVATE_ROUTES.BROADCAST },
  { name: 'Chat', path: `${PRIVATE_ROUTES.CHAT}/all` },
  { name: 'Counter', path: PRIVATE_ROUTES.COUNTER },
];
