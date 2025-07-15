const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('./generated/prisma');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const messageRoutes = require('./routes/messages');

// Initialize
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite dev server
    methods: ['GET', 'POST'],
  },
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true,
  })
);

// JSON parsing with error handling
app.use(
  express.json({
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(400).json({
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON',
        });
        throw new Error('Invalid JSON');
      }
    },
  })
);

// Handle empty body
app.use((req, res, next) => {
  // Log important requests only (not auth verify)
  if (!req.path.includes('/auth/verify')) {
    console.log(`📡 ${req.method} ${req.path}`, {
      headers: req.headers['content-type'],
      hasBody: !!req.body,
      query: Object.keys(req.query).length > 0 ? req.query : 'none',
    });
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (
      req.headers['content-type'] &&
      req.headers['content-type'].includes('application/json')
    ) {
      if (!req.body || Object.keys(req.body).length === 0) {
        console.log('⚠️ Empty body detected for', req.method, req.path);
        return res.status(400).json({
          error: 'Empty body',
          message: 'Request body is required for this endpoint',
        });
      }
    }
  }
  next();
});

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Socket.IO Chat Server is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Socket.IO connection handling
const connectedUsers = new Map(); // Store user info by socket ID
const userSockets = new Map(); // Store socket IDs by user ID

// Global counter state
let globalCounter = 0;
let lastCounterUpdatedBy = null;

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // Broadcast clients count update
  broadcastClientsCount();

  // Store user info when they connect with auth
  socket.on('user-connected', (userData) => {
    // Remove old socket for this user if exists
    if (userSockets.has(userData.id)) {
      const oldSocketId = userSockets.get(userData.id);
      connectedUsers.delete(oldSocketId);
    }

    connectedUsers.set(socket.id, userData);
    userSockets.set(userData.id, socket.id);
    console.log(
      '👤 User authenticated:',
      userData.firstName,
      userData.lastName,
      'Socket:',
      socket.id
    );

    // Broadcast updated online users list and clients count
    broadcastOnlineUsers();
    broadcastClientsCount();
  });

  // Get online users
  socket.on('get-online-users', () => {
    const users = Array.from(connectedUsers.values());
    socket.emit('online-users', users);
  });

  // Broadcast to all users
  socket.on('broadcast-to-all', (data) => {
    const sender = connectedUsers.get(socket.id);
    if (!sender) return;

    const broadcastData = {
      ...data,
      sender,
      fromSocketId: socket.id,
    };

    // Send to all connected clients except sender
    socket.broadcast.emit('broadcast-alert', broadcastData);

    // Send confirmation to sender
    socket.emit('broadcast-sent', {
      ...data,
      target: 'all users',
      recipientCount: connectedUsers.size - 1,
    });

    console.log(`📢 Broadcast to all from ${sender.firstName}:`, data.message);
  });

  // Broadcast to specific user
  socket.on('broadcast-to-user', (data) => {
    const sender = connectedUsers.get(socket.id);
    if (!sender) return;

    const broadcastData = {
      ...data,
      sender,
      fromSocketId: socket.id,
    };

    // Find target user's socket
    const targetSocketId = findUserSocketId(data.targetUserId);

    if (targetSocketId) {
      io.to(targetSocketId).emit('broadcast-alert', broadcastData);

      // Send confirmation to sender
      const targetUser = connectedUsers.get(targetSocketId);
      socket.emit('broadcast-sent', {
        ...data,
        target: `${targetUser?.firstName} ${targetUser?.lastName}`,
        recipientCount: 1,
      });

      console.log(
        `📢 Broadcast to user ${data.targetUserId} from ${sender.firstName}:`,
        data.message
      );
    } else {
      socket.emit('broadcast-error', {
        message: 'Target user not found or offline',
        targetUserId: data.targetUserId,
      });
    }
  });

  // Broadcast to multiple users
  socket.on('broadcast-to-users', (data) => {
    const sender = connectedUsers.get(socket.id);
    if (!sender) return;

    const broadcastData = {
      ...data,
      sender,
      fromSocketId: socket.id,
    };

    let sentCount = 0;
    const targetUsers = [];

    data.targetUserIds.forEach((userId) => {
      const targetSocketId = findUserSocketId(userId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('broadcast-alert', broadcastData);
        const targetUser = connectedUsers.get(targetSocketId);
        if (targetUser) {
          targetUsers.push(`${targetUser.firstName} ${targetUser.lastName}`);
        }
        sentCount++;
      }
    });

    // Send confirmation to sender
    socket.emit('broadcast-sent', {
      ...data,
      target: targetUsers.join(', '),
      recipientCount: sentCount,
    });

    console.log(
      `📢 Broadcast to ${sentCount} users from ${sender.firstName}:`,
      data.message
    );
  });

  // Broadcast to room
  socket.on('broadcast-to-room', (data) => {
    const sender = connectedUsers.get(socket.id);
    if (!sender) return;

    const broadcastData = {
      ...data,
      sender,
      fromSocketId: socket.id,
    };

    // Send to all users in the room except sender
    socket.to(data.roomId).emit('broadcast-alert', broadcastData);

    // Get room members count (approximation)
    const roomSockets = io.sockets.adapter.rooms.get(data.roomId);
    const recipientCount = roomSockets ? roomSockets.size - 1 : 0;

    // Send confirmation to sender
    socket.emit('broadcast-sent', {
      ...data,
      target: `Room: ${data.roomId}`,
      recipientCount,
    });

    console.log(
      `📢 Broadcast to room ${data.roomId} from ${sender.firstName}:`,
      data.message
    );
  });

  // Join room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`👤 User ${socket.id} joined room: ${roomId}`);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  // Leave room
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`👤 User ${socket.id} left room: ${roomId}`);
    socket.to(roomId).emit('user-left', socket.id);
  });

  // Handle new message
  socket.on('send-message', async (data) => {
    try {
      const { content, userId, roomId } = data;

      // Save message to database
      const message = await prisma.message.create({
        data: {
          content,
          userId,
          roomId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Broadcast to room
      io.to(roomId).emit('new-message', message);
      console.log(`💬 Message sent to room ${roomId}:`, content);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      socket.emit('message-error', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    socket.to(data.roomId).emit('user-typing', {
      userId: data.userId,
      userName: data.userName,
    });
  });

  socket.on('typing-stop', (data) => {
    socket.to(data.roomId).emit('user-stop-typing', {
      userId: data.userId,
    });
  });

  // Counter event handlers
  socket.on('get-counter', () => {
    socket.emit('counter-sync', {
      count: globalCounter,
      lastUpdatedBy: lastCounterUpdatedBy,
      connectedClients: io.sockets.sockets.size,
    });
  });

  socket.on('counter-increment', () => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    globalCounter++;
    lastCounterUpdatedBy = user;

    const updateData = {
      count: globalCounter,
      updatedBy: user,
    };

    // Broadcast to all connected clients
    io.emit('counter-updated', updateData);
    console.log(
      `🔢 Counter incremented to ${globalCounter} by ${user.firstName}`
    );
  });

  socket.on('counter-decrement', () => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    globalCounter--;
    lastCounterUpdatedBy = user;

    const updateData = {
      count: globalCounter,
      updatedBy: user,
    };

    // Broadcast to all connected clients
    io.emit('counter-updated', updateData);
    console.log(
      `🔢 Counter decremented to ${globalCounter} by ${user.firstName}`
    );
  });

  socket.on('counter-reset', () => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    globalCounter = 0;
    lastCounterUpdatedBy = user;

    const updateData = {
      count: globalCounter,
      updatedBy: user,
    };

    // Broadcast to all connected clients
    io.emit('counter-updated', updateData);
    console.log(`🔢 Counter reset to ${globalCounter} by ${user.firstName}`);
  });

  socket.on('counter-set', (data) => {
    const user = connectedUsers.get(socket.id);
    if (!user || typeof data.value !== 'number') return;

    globalCounter = data.value;
    lastCounterUpdatedBy = user;

    const updateData = {
      count: globalCounter,
      updatedBy: user,
    };

    // Broadcast to all connected clients
    io.emit('counter-updated', updateData);
    console.log(`🔢 Counter set to ${globalCounter} by ${user.firstName}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);

    // Find and remove user from both maps
    const userData = connectedUsers.get(socket.id);
    if (userData) {
      userSockets.delete(userData.id);
    }
    connectedUsers.delete(socket.id);

    // Broadcast updated online users list and clients count
    broadcastOnlineUsers();
    broadcastClientsCount();
  });
});

// Helper function to find user's socket ID
function findUserSocketId(userId) {
  for (const [socketId, userData] of connectedUsers.entries()) {
    if (userData.id === userId) {
      return socketId;
    }
  }
  return null;
}

// Helper function to broadcast online users list
function broadcastOnlineUsers() {
  // Get unique users (in case of multiple connections)
  const uniqueUsers = Array.from(connectedUsers.values()).filter(
    (user, index, arr) => arr.findIndex((u) => u.id === user.id) === index
  );

  console.log(`👥 Broadcasting ${uniqueUsers.length} unique online users`);
  io.emit('online-users', uniqueUsers);
}

// Helper function to broadcast clients count
function broadcastClientsCount() {
  const clientsCount = io.sockets.sockets.size;
  console.log(`👥 Broadcasting ${clientsCount} connected clients`);
  io.emit('clients-count', clientsCount);
}

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);

  // Handle JSON parsing errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'Request body must be valid JSON',
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    error: err.name || 'Internal server error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong',
  });
});

// Start server
server.listen(PORT, () => {
  console.log('🚀 Server started successfully!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log(`💬 Socket.IO ready for connections`);
  console.log(`📊 Database: SQLite (./prisma/dev.db)`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('✅ Server shut down gracefully');
    process.exit(0);
  });
});

module.exports = { app, server, io, prisma };
