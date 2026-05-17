const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const foodRoutes = require('./routes/foodRoutes');
const cartRoutes = require('./routes/cartRoutes');
const supportRoutes = require('./routes/supportRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/support', supportRoutes);

app.get('/', (req, res) => res.json({ message: 'FoodRush API is running!' }));
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.post('/api/seed', async (req, res) => {
  try {
    const Food = require('./models/Food');
    await Food.deleteMany({});
    const foods = require('./seed/foodData');
    await Food.insertMany(foods);
    res.json({ message: `Seeded ${foods.length} food items successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
