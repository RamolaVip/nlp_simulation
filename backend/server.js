require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const nlpRoutes = require('./routes/nlp');
const quizRoutes = require('./routes/quiz');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/nlp', nlpRoutes);
app.use('/api/quiz', quizRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const startServer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nlp_simulation';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.warn('MongoDB connection failed — running without database:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`NLP Simulation backend running on port ${PORT}`);
  });
};

startServer();
