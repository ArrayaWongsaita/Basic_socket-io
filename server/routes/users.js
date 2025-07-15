const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (protected route)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    });

    res.json({
      message: 'Users retrieved successfully',
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve users',
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            messages: true,
            rooms: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json({
      message: 'Profile retrieved successfully',
      user,
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve profile',
    });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            messages: true,
            rooms: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the specified ID',
      });
    }

    res.json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve user',
    });
  }
});

// Update current user profile
router.patch('/me', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const updates = {};

    // Only update provided fields
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'No valid fields to update',
        allowedFields: ['firstName', 'lastName'],
      });
    }

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: updates,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update profile',
    });
  }
});

// Search users by name or email
router.get('/search/:query', authenticateToken, async (req, res) => {
  try {
    const { query } = req.params;

    if (query.length < 2) {
      return res.status(400).json({
        error: 'Search query too short',
        message: 'Query must be at least 2 characters long',
      });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
      take: 20, // Limit results
      orderBy: {
        firstName: 'asc',
      },
    });

    res.json({
      message: 'Search completed successfully',
      users,
      count: users.length,
      query,
    });
  } catch (error) {
    console.error('❌ Search users error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to search users',
    });
  }
});

module.exports = router;
