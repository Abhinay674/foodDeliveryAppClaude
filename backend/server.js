require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const foodRoutes = require('./routes/foodRoutes');
const cartRoutes = require('./routes/cartRoutes');
const supportRoutes = require('./routes/supportRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/support', supportRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'FoodRush API is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.post('/api/seed', async (req, res) => {
  try {
    const Food = require('./models/Food');
    const foodData = require('./seed/foodData');
    await Food.deleteMany({});
    await Food.insertMany(foodData);
    res.json({ message: 'Database seeded!' });
  } catch (err) {
    res.status(500).json({ error: 'Seeding failed', details: err.message });
  }
});

let isConnected = false;
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('MongoDB connected');
});
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('MongoDB disconnected');
});

if (!isConnected) {
  mongoose.connect(process.env.MONGODB_URI);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;