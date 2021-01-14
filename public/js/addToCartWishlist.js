console.log('hello from the cart js');
const quantity = document.querySelector('.qty-text');
const quantityInc = document.querySelector('.qty-plus');
const quantityDec = document.querySelector('.qty-minus');
// const cartCount = document.querySelector('.cart-count');

let productPrice = 0;
quantityInc.addEventListener('click', (e) => {
  console.log('eventlistener working');
  const productPrice = e.target.parentNode.dataset.productprice;
  console.log(e.target.parentNode);
  console.log(productPrice);
  const calculatedAmount = quantity.value * productPrice;
  document.querySelector('.sub-total').textContent = `Rs.${calculatedAmount}`;
});

quantityDec.addEventListener('click', (e) => {
  console.log('eventlistener working');
  const productPrice = e.target.parentNode.dataset.productprice;
  console.log(e.target.parentNode);
  console.log(productPrice);
  const calculatedAmount = quantity.value * productPrice;
  document.querySelector('.sub-total').textContent = `Rs.${calculatedAmount}`;
});

// function calculateAmount() {
//   console.log('working');
//   const calculatedAmount = quantity.value * productprice;
//   console.log(calculatedAmount);
//   document.querySelector('.sub-total').textContent = `Rs.${calculatedAmount}`;
// }
