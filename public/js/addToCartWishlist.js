// const { default: axios } = require('axios');

console.log('hello from the cart js');
const quantity = document.querySelector('.qty-text');
const quantityInc = document.querySelector('.qty-plus');
const quantityDec = document.querySelector('.qty-minus');
const addToCartBtn = document.querySelector('#add-to-cart');
// const cartCount = document.querySelector('.cart-count');

let productPrice = 0;
if (quantityInc) {
  quantityInc.addEventListener('click', (e) => {
    console.log('eventlistener working');
    const productPrice = e.target.parentNode.dataset.productprice;
    console.log(e.target.parentNode);
    console.log(productPrice);
    const calculatedAmount = quantity.value * productPrice;
    document.querySelector('.sub-total').textContent = `Rs.${calculatedAmount}`;
  });
}

if (quantityDec) {
  quantityDec.addEventListener('click', (e) => {
    console.log('eventlistener working');
    const productPrice = e.target.parentNode.dataset.productprice;
    console.log(e.target.parentNode);
    console.log(productPrice);
    const calculatedAmount = quantity.value * productPrice;
    document.querySelector('.sub-total').textContent = `Rs.${calculatedAmount}`;
  });
}

// function calculateAmount() {
//   console.log('working');
//   const calculatedAmount = quantity.value * productprice;
//   console.log(calculatedAmount);
//   document.querySelector('.sub-total').textContent = `Rs.${calculatedAmount}`;
// }

if (addToCartBtn) {
  addToCartBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Added..';
    const currentUrl = window.location.href;
    const productId = e.target.dataset.productid;
    const res = await axios({
      method: 'GET',
      url: `/addToCartWishlist/${productId}`
    });
    e.target.textContent = 'Add to cart';
    location.assign(currentUrl);
    console.log(e.target);
    console.log(productId);
  });
}
