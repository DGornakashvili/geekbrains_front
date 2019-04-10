$(document).ready(() => {
  let miniCart = new CartPreview('json/getCart.json');

  $('.item-buy-btn').click(e => miniCart.addProduct(e));
});