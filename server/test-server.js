const express = require('express');
const cors = require('cors');

// Simple test to verify basic dependencies work
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Socket.IO Chat Server is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.listen(PORT, () => {
  console.log('🚀 Test server started successfully!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Test at: http://localhost:${PORT}`);
});

// Auto-close after 3 seconds for testing
setTimeout(() => {
  console.log('✅ Test completed successfully!');
  process.exit(0);
}, 3000);
