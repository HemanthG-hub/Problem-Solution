const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();

// CORS — allow production domain and local development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://hemanthg.xyz',
  'https://www.hemanthg.xyz',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

const connectMongo = async () => {
  const configuredUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/problem-platform';

  try {
    await mongoose.connect(configuredUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected to configured database');
  } catch (err) {
    console.warn('Configured MongoDB unavailable, falling back to in-memory database.');
    console.warn(err.message);

    const memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();

    await mongoose.connect(memoryUri);
    console.log('MongoDB connected using in-memory fallback');
  }
};

connectMongo();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ProbSol API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/problems', require('./routes/problems'));
app.use('/api/submissions', require('./routes/submissions'));

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  if (err.message && err.message.startsWith('CORS policy')) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));