# Socket.IO Chat Server

A Node.js server with Express, Socket.IO, and Prisma ORM for real-time chat functionality.

## 🚀 Features

- **Authentication**: JWT-based user authentication with signup/signin
- **Real-time Chat**: Socket.IO for instant messaging
- **Database**: SQLite database with Prisma ORM
- **User Management**: User profiles, search, and management
- **Room Management**: Public and private chat rooms
- **Message System**: Send, edit, delete messages with real-time updates
- **API Documentation**: RESTful API endpoints

## 📁 Project Structure

```
server/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js           # Database seeding
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── users.js          # User management routes
│   ├── rooms.js          # Room management routes
│   └── messages.js       # Message routes
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── generated/
│   └── prisma/           # Generated Prisma client
├── index.js              # Main server file
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
└── dev.db               # SQLite database file
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd server
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
CLIENT_URL="http://localhost:5173"
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm run db:generate

# Create database and tables
pnpm run db:push

# Seed database with sample data
pnpm run db:seed
```

### 4. Start Server

```bash
# Development mode (with auto-restart)
pnpm run dev

# Production mode
pnpm start
```

## 📊 Database Schema

### Users Table

- `id`: Unique identifier (CUID)
- `email`: User email (unique)
- `firstName`: User's first name
- `lastName`: User's last name
- `password`: Hashed password
- `isActive`: Account status
- `createdAt`: Account creation date
- `updatedAt`: Last update date

### Rooms Table

- `id`: Unique identifier (CUID)
- `name`: Room name
- `description`: Room description
- `isPrivate`: Private room flag
- `createdBy`: Creator user ID
- `createdAt`: Creation date
- `updatedAt`: Last update date

### Messages Table

- `id`: Unique identifier (CUID)
- `content`: Message content
- `userId`: Author user ID
- `roomId`: Room ID
- `createdAt`: Message timestamp
- `updatedAt`: Last edit timestamp

### Room Members Table

- `id`: Unique identifier (CUID)
- `userId`: Member user ID
- `roomId`: Room ID
- `role`: Member role (member, admin, owner)
- `joinedAt`: Join timestamp

## 🔐 Test Credentials

After running the seed script, you can use these test accounts:

```
Email: john@example.com
Password: password123

Email: jane@example.com
Password: password123

Email: admin@example.com
Password: password123
```

## 🌐 API Endpoints

### Authentication (`/api/auth`)

- `POST /signup` - Create new user account
- `POST /signin` - Sign in user
- `GET /verify` - Verify JWT token
- `POST /signout` - Sign out user

### Users (`/api/users`)

- `GET /` - Get all users (protected)
- `GET /me` - Get current user profile (protected)
- `GET /:id` - Get user by ID (protected)
- `PATCH /me` - Update current user profile (protected)
- `GET /search/:query` - Search users (protected)

### Rooms (`/api/rooms`)

- `GET /` - Get user's rooms (protected)
- `GET /:id` - Get room details (protected)
- `POST /` - Create new room (protected)
- `POST /:id/join` - Join a room (protected)
- `POST /:id/leave` - Leave a room (protected)

### Messages (`/api/messages`)

- `GET /room/:roomId` - Get room messages (protected)
- `POST /` - Send message (protected)
- `GET /:id` - Get specific message (protected)
- `PATCH /:id` - Edit message (protected)
- `DELETE /:id` - Delete message (protected)

## 🔌 Socket.IO Events

### Client to Server

- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `send-message` - Send a message
- `typing-start` - Start typing indicator
- `typing-stop` - Stop typing indicator

### Server to Client

- `new-message` - New message received
- `user-joined` - User joined room
- `user-left` - User left room
- `user-typing` - User is typing
- `user-stop-typing` - User stopped typing
- `message-error` - Message sending error

## 📝 Usage Examples

### Authentication

```javascript
// Sign up
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
  }),
});

// Sign in
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123',
  }),
});
```

### Protected Requests

```javascript
// Add JWT token to requests
const response = await fetch('/api/users/me', {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

### Socket.IO Connection

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Join room
socket.emit('join-room', 'room-id');

// Send message
socket.emit('send-message', {
  content: 'Hello world!',
  userId: 'user-id',
  roomId: 'room-id',
});

// Listen for new messages
socket.on('new-message', (message) => {
  console.log('New message:', message);
});
```

## 🛠️ Development

### Available Scripts

```bash
pnpm run dev          # Start development server with auto-restart
pnpm start            # Start production server
pnpm run db:generate  # Generate Prisma client
pnpm run db:push      # Push schema to database
pnpm run db:migrate   # Create and run migration
pnpm run db:studio    # Open Prisma Studio
pnpm run db:seed      # Seed database with sample data
```

### Database Management

```bash
# View database in browser
pnpm run db:studio

# Reset database
rm dev.db
pnpm run db:push
pnpm run db:seed
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Request validation and sanitization
- **CORS Configuration**: Proper cross-origin setup
- **Error Handling**: Secure error messages
- **Rate Limiting**: (Ready for implementation)

## 🚀 Production Deployment

1. Set strong JWT secret in environment
2. Use proper database (PostgreSQL recommended)
3. Enable HTTPS
4. Set up rate limiting
5. Configure proper CORS origins
6. Add logging and monitoring
7. Use PM2 for process management

## 📚 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.IO
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Development**: Nodemon

## 🤝 API Response Format

### Success Response

```json
{
  "message": "Operation successful",
  "data": { ... },
  "count": 10
}
```

### Error Response

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## 📞 Support

For issues and questions:

1. Check the API endpoints documentation
2. Verify authentication tokens
3. Check server logs for errors
4. Ensure database is properly seeded

Happy coding! 🎉
