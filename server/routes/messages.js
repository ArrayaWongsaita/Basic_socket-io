const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get messages for a room
router.get('/room/:roomId', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Check if user has access to this room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        members: {
          where: { userId: req.user.userId },
        },
      },
    });

    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
      });
    }

    // Check access for private rooms
    if (room.isPrivate && room.members.length === 0) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have access to this room',
      });
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: { roomId },
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
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    });

    // Get total count for pagination
    const totalMessages = await prisma.message.count({
      where: { roomId },
    });

    const totalPages = Math.ceil(totalMessages / parseInt(limit));

    res.json({
      message: 'Messages retrieved successfully',
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalMessages,
        limit: parseInt(limit),
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error('❌ Get messages error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve messages',
    });
  }
});

// Send a message to a room
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Request body must be a valid JSON object',
      });
    }

    const { content, roomId } = req.body;

    // Validate required fields
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        error: 'Content is required',
        message: 'Content must be a non-empty string',
      });
    }

    if (!roomId || typeof roomId !== 'string') {
      return res.status(400).json({
        error: 'Room ID is required',
        message: 'Room ID must be a valid string',
      });
    }

    // Validate content
    if (content.trim().length === 0) {
      return res.status(400).json({
        error: 'Message content cannot be empty',
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        error: 'Message too long',
        message: 'Message cannot exceed 1000 characters',
      });
    }

    // Check if user has access to this room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        members: {
          where: { userId: req.user.userId },
        },
      },
    });

    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
      });
    }

    // Check access for private rooms
    if (room.isPrivate && room.members.length === 0) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have access to this room',
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        userId: req.user.userId,
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
        room: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Broadcast message to room members via Socket.IO
    if (req.io) {
      req.io.to(roomId).emit('new-message', message);
      console.log(`📨 Message broadcasted to room ${roomId}:`, message.content);
    }

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send message',
    });
  }
});

// Get a specific message
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            isPrivate: true,
            members: {
              where: { userId: req.user.userId },
            },
          },
        },
      },
    });

    if (!message) {
      return res.status(404).json({
        error: 'Message not found',
      });
    }

    // Check access for private rooms
    if (message.room.isPrivate && message.room.members.length === 0) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have access to this message',
      });
    }

    res.json({
      message: 'Message retrieved successfully',
      data: message,
    });
  } catch (error) {
    console.error('❌ Get message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve message',
    });
  }
});

// Update a message (only by author)
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: 'Content is required',
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        error: 'Message content cannot be empty',
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        error: 'Message too long',
        message: 'Message cannot exceed 1000 characters',
      });
    }

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({
        error: 'Message not found',
      });
    }

    // Only allow author to edit their message
    if (message.userId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only edit your own messages',
      });
    }

    // Update message
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        content: content.trim(),
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

    res.json({
      message: 'Message updated successfully',
      data: updatedMessage,
    });
  } catch (error) {
    console.error('❌ Update message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update message',
    });
  }
});

// Delete a message (only by author)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({
        error: 'Message not found',
      });
    }

    // Only allow author to delete their message
    if (message.userId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own messages',
      });
    }

    await prisma.message.delete({
      where: { id },
    });

    res.json({
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete message',
    });
  }
});

module.exports = router;
