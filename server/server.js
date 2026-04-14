const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const nodeRoutes = require('./routes/nodeRoutes');
const edgeRoutes = require('./routes/edgeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/nodes', nodeRoutes);
app.use('/api/edges', edgeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FirstGlance API running' });
});

// MongoDB connection + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
