const localStorage = require('localStorage');

const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const products = await Product.find().sort({ name: 1 });
  // const userName = localStorage.getItem('userName');
  let userName = null;
  if (req.user) {
    userName = (await User.findById(req.user.id)).name.split(' ')[0];
  }
  let count = null;
  if (req.user) count = req.user.cart.length;
  console.log(count);
  console.log(req.user);

  res.status(200).render('overview', {
    title: 'Home',
    products,
    userName,
    count
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
  // const userName = localStorage.getItem('userName');
  let userName = null;
  if (req.user) {
    userName = (await User.findById(req.user.id)).name.split(' ')[0];
  }
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

// exports.getAddToCartWishlist = catchAsync(async (req, res, next) => {
//   const productId = req.params.productId;
//   const cart = req.user.cart.slice();

//   const productsIdArr = (await Product.find()).map((el) => {
//     return el.id;
//   });

//   if (!cart.includes(productId)) {
//     if (productsIdArr.includes(productId)) {
//       cart.push(productId);
//     }
//   }
//   // console.log(cart);
//   const user = await User.findByIdAndUpdate(
//     req.user.id,
//     { cart },
//     { new: true }
//   );
//   // console.log(user);
//   const promises = cart.map((el) => {
//     const product = Product.findById(el);
//     // console.log(product.images);
//     return product;
//   });

//   let products = [];
//   Promise.all(promises)
//     .then((result) => {
//       const totalCartAmount = result
//         .map((product) => {
//           return product.price;
//         })
//         .reduce((acc, cur) => {
//           return acc + cur;
//         });
//       res.status(200).render('addToCartWishlist', {
//         title: 'Add to Cart',
//         products: result,
//         totalCartAmount
//       });
//       // products = result.slice();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   // console.log(products);
// });

exports.getAddToCartWishlist = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;

  // Get a copy of the cart from the logged in user
  const cart = req.user.cart.slice();
  console.log(cart);

  // Collecting all the product ids from the product table
  // const productsIdArr = (await Product.find()).map((el) => {
  //   return el.id;
  // });

  // Check if the item is already in the cart or not, then push it or increase quantity
  // if (cart.length > 0) {
  //   cart.forEach((el) => {
  //     if (el.productId === productId) {
  //       if (productsIdArr.includes(productId)) {
  //         el.quantity++;
  //       }
  //     } else {
  //       cart.push({
  //         productId,
  //         quantity: 1
  //       });
  //     }
  //   });
  // } else {
  //   cart.push({
  //     productId,
  //     quantity: 1
  //   });
  // }
  console.log('cart length: ' + cart.length);
  if (cart.length === 0) {
    cart.push({
      productId,
      quantity: 1
    });
  } else {
    let count = 0;
    cart.forEach((el) => {
      if (el.productId === productId) {
        el.quantity++;
        count = 1;
      }
    });
    if (count === 0) {
      cart.push({
        productId,
        quantity: 1
      });
    }
  }
  console.log(cart);

  const cartQtyArr = cart.map((el) => {
    return el.quantity;
  });

  // Update the user cart
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { cart },
    { new: true }
  );

  // Collecting the products from the product table as promises which is not resolved yet
  const promises = cart.map((el) => {
    const productPromise = Product.findById(el.productId);
    return productPromise;
  });

  // Get a blank products array
  let products = [];

  // Get all the resolved value of the promises array
  Promise.all(promises)
    .then((result) => {
      let totalCartAmount = 0;
      products = result.slice();
      // Calculating the total amount summary
      if (products.length > 0) {
        totalCartAmount = result
          .map((el, i) => {
            return el.price * cartQtyArr[i];
          })
          .reduce((acc, cur) => {
            return acc + cur;
          });
      }
      console.log(totalCartAmount);

      // Send the products to the cart page
      res.status(200).render('addToCartWishlist', {
        status: 'success',
        products,
        totalCartAmount,
        cartQtyArr
      });
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(products);
});

exports.getCartFromHomePage = async (req, res, next) => {
  const cart = req.user.cart.slice();

  const cartQtyArr = cart.map((el) => {
    return el.quantity;
  });

  // Collecting the products from the product table as promises which is not resolved yet
  const promises = cart.map((el) => {
    const productPromise = Product.findById(el.productId);
    return productPromise;
  });

  // Get a blank products array
  let products = [];

  // Get all the resolved value of the promises array
  Promise.all(promises)
    .then((result) => {
      let totalCartAmount = 0;
      products = result.slice();
      // Calculating the total amount summary
      if (products.length > 0) {
        totalCartAmount = result
          .map((el, i) => {
            return el.price * cartQtyArr[i];
          })
          .reduce((acc, cur) => {
            return acc + cur;
          });
      }

      // Send the products to the cart page
      res.status(200).render('addToCartWishlist', {
        title: 'Add to Cart',
        products: result,
        totalCartAmount,
        cartQtyArr
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
