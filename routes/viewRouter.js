const express = require('express');
const router = express.Router();

const viewController = require('./../controllers/viewController');
const authController = require('../controllers/authController');

router.get('/', authController.isLoggedIn, viewController.getOverview);
// router.get('/shop', viewController.getProducts);
router.get('/productDetails', viewController.getProductDetails);
router.get(
  '/product/:slug',
  authController.isLoggedIn,
  viewController.getProductBySlug
);
router.route('/me').get(authController.protect, viewController.getMe);
router
  .route('/addTocartWishlist/getAddToCartPage')
  .get(authController.protect, viewController.getCartFromHomePage);
router
  .route('/addToCartWishlist/:productId')
  .get(authController.protect, viewController.getAddToCartWishlist);

module.exports = router;
