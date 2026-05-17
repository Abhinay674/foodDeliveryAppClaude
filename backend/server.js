// backend/server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const foodRoutes = require('./routes/foodRoutes');
const cartRoutes = require('./routes/cartRoutes');
const supportRoutes = require('./routes/supportRoutes');
const authRoutes = require('./routes/authRoutes');
const Food = require('./models/Food'); // For seeding

const app = express();

// CORS config
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/support', supportRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'FoodRush API is running!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Seed endpoint
app.post('/api/seed', async (req, res) => {
  try {
    // Example seed data
    const foods = [
      {
        name: 'Classic Burger',
        description: 'Juicy beef patty, lettuce, tomato, cheese, and our special sauce.',
        price: 8.99,
        category: 'Burgers',
        image: '/images/burger.jpg',
      },
      {
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomatoes, basil, and olive oil.',
        price: 10.99,
        category: 'Pizza',
        image: '/images/pizza.jpg',
      },
      {
        name: 'Caesar Salad',
        description: 'Crisp romaine, parmesan, croutons, and Caesar dressing.',
        price: 7.49,
        category: 'Salads',
        image: '/images/salad.jpg',
      },
    ];
    await Food.deleteMany({});
    await Food.insertMany(foods);
    res.json({ success: true, message: 'Food data seeded successfully', count: foods.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Seeding failed' });
  }
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodrush';
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB connected');
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;