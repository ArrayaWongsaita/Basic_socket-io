const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all rooms user has access to
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        OR: [
          { isPrivate: false }, // Public rooms
          {
            members: {
              some: { userId: req.user.userId },
            },
          }, // Private rooms user is member of
        ],
      },
      include: {
        _count: {
          select: {
            members: true,
            messages: true,
          },
        },
        members: {
          where: { userId: req.user.userId },
          select: { role: true, joinedAt: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      message: 'Rooms retrieved successfully',
      rooms,
      count: rooms.length,
    });
  } catch (error) {
    console.error('❌ Get rooms error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve rooms',
    });
  }
});

// Get room by ID with members
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        members: {
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
          orderBy: { joinedAt: 'asc' },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
      });
    }

    // Check if user has access to this room
    const userMember = room.members.find((m) => m.userId === req.user.userId);
    if (room.isPrivate && !userMember) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have access to this private room',
      });
    }

    res.json({
      message: 'Room retrieved successfully',
      room,
    });
  } catch (error) {
    console.error('❌ Get room error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve room',
    });
  }
});

// Create a new room
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Request body must be a valid JSON object',
      });
    }

    const { name, description, isPrivate = false } = req.body;

    // Validate required fields
    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        error: 'Room name is required',
        message: 'Room name must be a non-empty string',
      });
    }

    // Validate field lengths
    if (name.trim().length === 0) {
      return res.status(400).json({
        error: 'Room name cannot be empty',
      });
    }

    if (name.length > 50) {
      return res.status(400).json({
        error: 'Room name too long',
        message: 'Room name cannot exceed 50 characters',
      });
    }

    if (
      description &&
      typeof description === 'string' &&
      description.length > 200
    ) {
      return res.status(400).json({
        error: 'Description too long',
        message: 'Description cannot exceed 200 characters',
      });
    }

    // Check if room name already exists
    const existingRoom = await prisma.room.findFirst({
      where: { name },
    });

    if (existingRoom) {
      return res.status(409).json({
        error: 'Room name already exists',
        message: 'Please choose a different name',
      });
    }

    // Create room with creator as admin
    const room = await prisma.room.create({
      data: {
        name,
        description,
        isPrivate,
        createdBy: req.user.userId,
        members: {
          create: {
            userId: req.user.userId,
            role: 'admin',
          },
        },
      },
      include: {
        members: {
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
        },
      },
    });

    res.status(201).json({
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    console.error('❌ Create room error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create room',
    });
  }
});

// Join a room
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
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

    if (room.isPrivate) {
      return res.status(403).json({
        error: 'Cannot join private room',
        message: 'You need to be invited to join this room',
      });
    }

    // Check if already a member
    if (room.members.length > 0) {
      return res.status(409).json({
        error: 'Already a member',
        message: 'You are already a member of this room',
      });
    }

    // Add user to room
    const membership = await prisma.roomMember.create({
      data: {
        userId: req.user.userId,
        roomId: id,
        role: 'member',
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
            description: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Joined room successfully',
      membership,
    });
  } catch (error) {
    console.error('❌ Join room error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to join room',
    });
  }
});

// Leave a room
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const membership = await prisma.roomMember.findFirst({
      where: {
        userId: req.user.userId,
        roomId: id,
      },
    });

    if (!membership) {
      return res.status(404).json({
        error: 'Not a member',
        message: 'You are not a member of this room',
      });
    }

    // Remove membership
    await prisma.roomMember.delete({
      where: { id: membership.id },
    });

    res.json({
      message: 'Left room successfully',
    });
  } catch (error) {
    console.error('❌ Leave room error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to leave room',
    });
  }
});

module.exports = router;
