export const learningTopics = [
  {
    title: 'Real-time Chat',
    description:
      'Learn how to implement rooms, private messaging, typing indicators, and message persistence.',
    features: [
      'Chat rooms',
      'Private messages',
      'Typing indicators',
      'Message history',
    ],
    link: '/chat/all',
  },
  {
    title: 'Broadcasting Patterns',
    description:
      'Master different Socket.IO emit patterns for sending messages to various targets.',
    features: [
      'Broadcast to all',
      'Send to specific user',
      'Send to room',
      'Send to multiple users',
    ],
    link: '/broadcast',
  },
  {
    title: 'Real-time Synchronization',
    description:
      'Understand how to keep data synchronized across multiple clients in real-time.',
    features: [
      'Global state sync',
      'Conflict resolution',
      'Client updates',
      'Server authority',
    ],
    link: '/counter',
  },
];
