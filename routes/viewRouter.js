const express = require('express');
const router = express.Router();

const viewController = require('./../controllers/viewController');
const authController = require('../controllers/authController');

router.get('/', viewController.getOverview);
// router.get('/shop', viewController.getProducts);
router.get('/productDetails', viewController.getProductDetails);
router.get('/product/:slug', viewController.getProductBySlug);
router.route('/me').get(authController.protect, viewController.getMe);
router
  .route('/addToCartWishlist/:productId')
  .get(authController.protect, viewController.getAddToCartWishlist);

module.exports = router;
