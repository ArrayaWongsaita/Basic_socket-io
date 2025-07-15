import {
  ChatBubbleLeftRightIcon,
  SpeakerWaveIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';

export const features = [
  {
    title: 'Real-time Chat',
    description:
      'Connect with others instantly through our advanced chat system with rooms, typing indicators, and message history.',
    icon: ChatBubbleLeftRightIcon,
    link: '/chat',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
  },
  {
    title: 'Broadcast System',
    description:
      'Learn Socket.IO broadcasting patterns - send alerts to all users, specific users, or rooms in real-time.',
    icon: SpeakerWaveIcon,
    link: '/broadcast',
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
  },
  {
    title: 'Synchronized Counter',
    description:
      'Experience real-time synchronization with a global counter that updates across all connected clients instantly.',
    icon: CalculatorIcon,
    link: '/counter',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
  },
];

export const technologies = [
  {
    name: 'React 19',
    description: 'Latest React with new features and optimizations',
    color: 'bg-blue-500',
    icon: '⚛️',
  },
  {
    name: 'Socket.IO',
    description: 'Real-time bidirectional event-based communication',
    color: 'bg-green-500',
    icon: '🔌',
  },
  {
    name: 'Express.js',
    description: 'Fast, unopinionated web framework for Node.js',
    color: 'bg-gray-600',
    icon: '🚀',
  },
  {
    name: 'Prisma',
    description: 'Next-generation ORM for Node.js and TypeScript',
    color: 'bg-purple-500',
    icon: '🗄️',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid UI development',
    color: 'bg-cyan-500',
    icon: '🎨',
  },
  {
    name: 'Vite',
    description: 'Lightning-fast build tool for modern web development',
    color: 'bg-orange-500',
    icon: '⚡',
  },
];
