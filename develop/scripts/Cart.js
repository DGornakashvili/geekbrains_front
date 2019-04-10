class Cart {
  constructor(container = '.main-cart-container') {
    this.container = container;
    this.countGoods = 0;
    this.amount = 0;
    this.cartItems = [];
    this._init();
  }

  _init() {
    this._render();

    this.cartItems = JSON.parse(localStorage.getItem('userCart'));
    this.amount = JSON.parse(localStorage.getItem('amount'));
    this.countGoods = JSON.parse(localStorage.getItem('countGoods'));

    for (let product of this.cartItems) {
      this._renderItem(product);
    }
    this._renderSum();
    $('.clear-cart-btn').click(evt => this._clearCart(evt));
  }

  _render() {
    let $cartWrapper = $('<div/>', {
      class: 'cart-wrapper'
    });

    let $cartHeading = $('<div class="main-cart-title"></div>');

    $cartHeading.append($('<p class="main-cart-heading">Product Details</p>'));
    $cartHeading.append($('<p class="main-cart-heading">unite Price</p>'));
    $cartHeading.append($('<p class="main-cart-heading">Quantity</p>'));
    $cartHeading.append($('<p class="main-cart-heading">shipping</p>'));
    $cartHeading.append($('<p class="main-cart-heading">Subtotal</p>'));
    $cartHeading.append($('<p class="main-cart-heading">ACTION</p>'));

    $cartWrapper.append($cartHeading);

    $(this.container).prepend($cartWrapper);
  }

  _renderItem(product) {
    let $itemsWrapper = $('<div/>', {
      class: "main-cart-item",
      'data-id': product.id
    });

    let $wrapper = $('<article/>', {
      class: 'main-cart-product'
    });

    let $container = $('<a/>', {
      href: "single-page.html",
      class: "cart-item-link",
    });

    $container.append($(`<img class="main-cart-product-image" src="${product.imageSrc}" alt="${product.name}">`));

    let $productDtls = $('<div/>', {
      class: "main-cart-product-details"
    });

    $productDtls.append($(`<h3 class="main-cart-product-title">${product.name}</h3>`));

    let $color = $(`<p class="main-cart-product-p">Color: </p>`);
    $color.append($(`<span class="main-cart-product-span">${product.color}</span>`));
    $productDtls.append($color);

    let $size = $(`<p class="main-cart-product-p">Size: </p>`);
    $size.append($(`<span class="main-cart-product-span">${product.size}</span>`));
    $productDtls.append($size);

    $container.append($productDtls);
    $wrapper.append($container);
    $itemsWrapper.append($wrapper);
    $itemsWrapper.append($(`<div class="main-cart-elements">$${product.price}</div>`));

    let $inputCont = $('<div class="main-cart-elements"></div>');
    let $input = $(`<input class="main-cart-product-input" type="number" min="1" max="10">`);
    $input.val(product.quantity);
    $input.on('input', evt => this._watchQuantity(evt, product.id));
    $inputCont.append($input);
    $itemsWrapper.append($inputCont);
    $itemsWrapper.append($(`<div class="main-cart-elements">${product.ship}</div>`));
    $itemsWrapper.append($(`<div class="main-cart-elements product-price">$${product.quantity * product.price}</div>`));

    let $removeCont = $('<div class="main-cart-elements"></div>');
    let $removeBtn = $('<i class="fas fa-times-circle"></i>');
    $removeBtn.click(evt => this._remove(evt, product.id));
    $removeCont.append($removeBtn);

    $itemsWrapper.append($removeCont);
    $itemsWrapper.appendTo($('.cart-wrapper'));
  }

  _watchQuantity(evt, id) {
    if (evt.target.value > 10) {
      evt.target.value = 10;
    } else if (evt.target.value < 1) {
      evt.target.value = 1;
    }
    let product = this.cartItems.find(el => el.id === id);
    let reduce = evt.target.value - product.quantity;

    product.quantity += reduce;
    this.countGoods += reduce;
    this.amount += product.price * reduce;
    this._updateCart(product);
    this._renderSum();

    localStorage.setItem('userCart', JSON.stringify(this.cartItems));
    localStorage.setItem('amount', JSON.stringify(this.amount));
    localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
  }

  _renderSum() {
    $('.cart-checkout-sub-span').text(`$${this.amount}`);
    $('.cart-checkout-grand-span').text(`$${this.amount}`);
  }

  _updateCart(product) {
    let $container = $(`.main-cart-item[data-id="${product.id}"]`);
    $container.find('.main-cart-product-input').val(`${product.quantity}`);
    $container.find('.product-price').text(`$${product.quantity * product.price}`);
  }

  _remove(e, id) {
    e.preventDefault();
    let product = this.cartItems.find(item => item.id === id);
    if (product.quantity > 1) {
      product.quantity--;
      this._updateCart(product);
    } else {
      $(`.main-cart-item[data-id="${id}"]`).remove();
      this.cartItems.splice(this.cartItems.indexOf(product), 1);
    }
    this.amount -= product.price;
    this.countGoods--;

    localStorage.setItem('userCart', JSON.stringify(this.cartItems));
    localStorage.setItem('amount', JSON.stringify(this.amount));
    localStorage.setItem('countGoods', JSON.stringify(this.countGoods));

    this._renderSum();
  }

  _clearCart(evt) {
    evt.preventDefault();
    $('.main-cart-item').remove();

    this.cartItems = [];
    this.amount = 0;
    this.countGoods = 0;

    this._renderSum();

    localStorage.setItem('userCart', JSON.stringify(this.cartItems));
    localStorage.setItem('amount', JSON.stringify(this.amount));
    localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
  }
}