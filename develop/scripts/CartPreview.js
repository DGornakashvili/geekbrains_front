class CartPreview {
  constructor(source, container = '.cart-img-parent') {
    this.source = source;
    this.container = container;
    this.countGoods = 0;
    this.amount = 0;
    this.cartItems = [];
    this._init();
  }

  _init() {
    this._render();
    if (!localStorage.getItem('userCart')) {
      fetch(this.source)
        .then(result => result.json())
        .then(data => {
          for (let product of data.contents) {
            this.cartItems.push(product);
            this._renderItem(product);
          }
          this.countGoods = data.countGoods;
          this.amount = data.amount;
          this._renderSum();

          localStorage.setItem('userCart', JSON.stringify(this.cartItems));
          localStorage.setItem('amount', JSON.stringify(this.amount));
          localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
        })
    } else {
      this.cartItems = JSON.parse(localStorage.getItem('userCart'));
      this.amount = JSON.parse(localStorage.getItem('amount'));
      this.countGoods = JSON.parse(localStorage.getItem('countGoods'));

      for (let product of this.cartItems) {
        this._renderItem(product);
      }
      this._renderSum();
    }
  }

  _render() {
    let $cartWrapper = $('<div/>', {
      class: 'cart-preview'
    });

    let $cartItemsCont = $('<div class="cart-items-container"></div>');

    let $total = $('<div/>', {
      class: 'cart-subtotal'
    });
    $total.append($('<p>TOTAL</p>'));
    $total.append($(`<p class="cart-subtotal_price">$ ${this.amount}</p>`));

    $cartWrapper.append($cartItemsCont);
    $cartWrapper.append($total);
    $cartWrapper.append($('<a href="checkout.html" class="cart-buttons">Checkout</a>'));
    $cartWrapper.append($('<a href="shopping-cart.html" class="cart-buttons">Go to cart</a>'));
    $(this.container).append($(`<span class="cart-subtotal_quantity">${this.countGoods}</span>`));
    $(this.container).after($cartWrapper);
  }

  _renderItem(product) {
    let $wrapper = $('<article/>', {
      class: 'cart-item',
      'data-id': product.id
    });

    let $removeBtn = $('<a/>', {
      href: "#",
      class: "cart-item_remove",
    });
    $removeBtn.append($('<i class="fas fa-times-circle"></i>'));
    $removeBtn.click(evt => this._remove(evt, product.id));

    let $container = $('<a/>', {
      href: "single-page.html",
      class: "cart-item-link",
    });

    $container.append($(`<img class="cart-item-image" src="${product.imageSrc}" alt="${product.name}">`));

    let $productDtls = $('<div/>', {
      class: "cart-item-details"
    });

    $productDtls.append($(`<h3 class="cart-item-title">${product.name}</h3>`));
    $productDtls.append($(`<p class="cart-item-rate">${product.rate}</p>`));
    $productDtls.append($(`<p class="cart-item-price">${product.quantity} x $${product.price}</p>`));

    $container.append($productDtls);
    $wrapper.append($container);
    $wrapper.append($removeBtn);
    $wrapper.appendTo($('.cart-items-container'));
  }

  _renderSum() {
    $('.cart-subtotal_quantity').text(`${this.countGoods}`);
    $('.cart-subtotal_price').text(`$ ${this.amount}`);
  }

  _updateCart(product) {
    let $container = $(`.cart-item[data-id="${product.id}"]`);
    $container.find('.cart-item-price').text(`${product.quantity} x $${product.price}`);
  }

  addProduct(evt) {
    evt.preventDefault();
    let $block = $(evt.currentTarget);
    let productId = 0;

    if ($block.data('id')) {
      productId = +$block.data('id');
    } else {
      let ids = [];
      $('.cart-item[data-id]').each((i, el) => ids.push(el.dataset.id));
      productId = Math.max.apply(0, ids) + 1;
      $block.attr('data-id', productId);
    }

    let find = this.cartItems.find(product => product.id === productId);
    if (find) {
      find.quantity++;
      this.countGoods++;
      this.amount += find.price;
      this._updateCart(find);
    } else {
      let $element = $block.parent().siblings('.fi-details');

      let product = {
        id: productId,
        imageSrc: $element.find('.fi-image').attr('src'),
        name: $element.find('.fi-name').text(),
        color: "Red",
        size: "Xl",
        ship: "FREE",
        price: +($element.find('.fi-price').text().slice(1)),
        quantity: 1,
        rate: `<i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star-half-alt'></i>`
      };

      this.cartItems.push(product);
      this._renderItem(product);
      this.amount += product.price;
      this.countGoods += product.quantity;
    }
    this._renderSum();

    localStorage.setItem('userCart', JSON.stringify(this.cartItems));
    localStorage.setItem('amount', JSON.stringify(this.amount));
    localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
  }

  _remove(e, id) {
    e.preventDefault();
    let product = this.cartItems.find(item => item.id === id);
    if (product.quantity > 1) {
      product.quantity--;
      this._updateCart(product);
    } else {
      $(`.cart-item[data-id="${id}"]`).remove();
      this.cartItems.splice(this.cartItems.indexOf(product), 1);
    }
    this.amount -= product.price;
    this.countGoods--;
    this._renderSum();

    localStorage.setItem('userCart', JSON.stringify(this.cartItems));
    localStorage.setItem('amount', JSON.stringify(this.amount));
    localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
  }
}