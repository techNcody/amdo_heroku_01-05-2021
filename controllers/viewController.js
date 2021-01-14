const localStorage = require('localStorage');

const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const products = await Product.find().sort({ name: 1 });
  const userName = localStorage.getItem('userName');

  res.status(200).render('overview', {
    title: 'Home',
    products,
    userName
  });
});

// exports.getProducts = (req, res, next) => {
//   res.status(200).render('shop', {
//     title: 'Products'
//   });
// };

exports.getProductDetails = (req, res, next) => {
  res.status(200).render('productDetails', {
    title: 'product Details',
    userName
  });
};

exports.getProductBySlug = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });
  // console.log(product.specification);
  const userName = localStorage.getItem('userName');
  // console.log(userName);

  res.status(200).render('productDetails', {
    title: 'Product Details',
    product,
    speci: product.specification,
    userName,
    images: product.images
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).render('overview', {
    data: {
      title: 'Overview',
      user
    }
  });
});

exports.getAddToCartWishlist = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  const cart = req.user.cart.slice();

  const productsIdArr = (await Product.find()).map((el) => {
    return el.id;
  });

  if (!cart.includes(productId)) {
    if (productsIdArr.includes(productId)) {
      cart.push(productId);
    }
  }
  // console.log(cart);
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { cart },
    { new: true }
  );
  // console.log(user);
  const promises = cart.map((el) => {
    const product = Product.findById(el);
    // console.log(product.images);
    return product;
  });

  let products = [];
  Promise.all(promises)
    .then((result) => {
      const totalCartAmount = result
        .map((product) => {
          return product.price;
        })
        .reduce((acc, cur) => {
          return acc + cur;
        });
      res.status(200).render('addToCartWishlist', {
        title: 'Add to Cart',
        products: result,
        totalCartAmount
      });
      // products = result.slice();
    })
    .catch((err) => {
      console.log(err);
    });
  // console.log(products);
});
