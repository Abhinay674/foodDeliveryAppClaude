const mongoose = require('mongoose');
const Food = require('../models/Food');
const foods = require('./foodData');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Food.deleteMany({});
    console.log('Cleared existing food items');

    const inserted = await Food.insertMany(foods);
    console.log(`Successfully seeded ${inserted.length} food items`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
