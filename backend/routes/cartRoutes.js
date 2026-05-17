const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

router.get('/:sessionId', getCart);
router.post('/:sessionId', addToCart);
router.put('/:sessionId/:foodId', updateCartItem);
router.delete('/:sessionId/:foodId', removeFromCart);
router.delete('/:sessionId', clearCart);

module.exports = router;
