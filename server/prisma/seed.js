const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create default users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: hashedPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: hashedPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
      },
    }),
  ]);

  console.log('👥 Created users:', users.length);

  // Create default rooms
  const rooms = await Promise.all([
    prisma.room.upsert({
      where: { id: 'general' },
      update: {},
      create: {
        id: 'general',
        name: 'General',
        description: 'General discussion room',
        isPrivate: false,
        createdBy: users[2].id, // Admin user
      },
    }),
    prisma.room.upsert({
      where: { id: 'random' },
      update: {},
      create: {
        id: 'random',
        name: 'Random',
        description: 'Random chit-chat',
        isPrivate: false,
        createdBy: users[2].id, // Admin user
      },
    }),
  ]);

  console.log('🏠 Created rooms:', rooms.length);

  // Add users to rooms
  const roomMembers = await Promise.all([
    // Add all users to general room
    ...users.map((user) =>
      prisma.roomMember.upsert({
        where: {
          userId_roomId: {
            userId: user.id,
            roomId: rooms[0].id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roomId: rooms[0].id,
          role: user.email === 'admin@example.com' ? 'admin' : 'member',
        },
      })
    ),
    // Add users to random room
    ...users.slice(0, 2).map((user) =>
      prisma.roomMember.upsert({
        where: {
          userId_roomId: {
            userId: user.id,
            roomId: rooms[1].id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roomId: rooms[1].id,
          role: 'member',
        },
      })
    ),
  ]);

  console.log('👥 Created room memberships:', roomMembers.length);

  // Create some sample messages
  const messages = await Promise.all([
    prisma.message.create({
      data: {
        content: 'Welcome to the general chat room! 👋',
        userId: users[2].id, // Admin
        roomId: rooms[0].id, // General
      },
    }),
    prisma.message.create({
      data: {
        content: 'Hello everyone! Happy to be here.',
        userId: users[0].id, // John
        roomId: rooms[0].id, // General
      },
    }),
    prisma.message.create({
      data: {
        content: 'This is a great chat app!',
        userId: users[1].id, // Jane
        roomId: rooms[1].id, // Random
      },
    }),
  ]);

  console.log('💬 Created messages:', messages.length);

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${users.length}`);
  console.log(`- Rooms: ${rooms.length}`);
  console.log(`- Room memberships: ${roomMembers.length}`);
  console.log(`- Messages: ${messages.length}`);
  console.log('\n🔐 Test credentials:');
  console.log('Email: john@example.com | Password: password123');
  console.log('Email: jane@example.com | Password: password123');
  console.log('Email: admin@example.com | Password: password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
