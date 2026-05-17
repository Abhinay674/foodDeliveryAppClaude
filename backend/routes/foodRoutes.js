const express = require('express');
const router = express.Router();
const { getAllFoods, getFoodById, getCategories } = require('../controllers/foodController');

router.get('/categories', getCategories);
router.get('/', getAllFoods);
router.get('/:id', getFoodById);

module.exports = router;
