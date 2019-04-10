$(document).ready(() => {
  $('.slider-toggle__left').click(evt => {
    evt.preventDefault();
    let $currentImg = $('.slider-img__active');
    if ($('.slider-img').first().hasClass('slider-img__active')) {
      $('.slider-img').last()
        .removeClass('slider-img__hidden')
        .addClass('slider-img__active');
    } else {
      $currentImg
        .prev()
        .removeClass('slider-img__hidden')
        .addClass('slider-img__active');
    }
    $currentImg
      .addClass('slider-img__hidden')
      .removeClass('slider-img__active');
  });

  $('.slider-toggle__right').click(evt => {
    evt.preventDefault();
    let $currentImg = $('.slider-img__active');
    if ($('.slider-img').last().hasClass('slider-img__active')) {
      $('.slider-img').first()
        .removeClass('slider-img__hidden')
        .addClass('slider-img__active');
    } else {
      $currentImg
        .next()
        .removeClass('slider-img__hidden')
        .addClass('slider-img__active');
    }
    $currentImg
      .addClass('slider-img__hidden')
      .removeClass('slider-img__active');
  });

  $.widget('custom.iconselectmenu', $.ui.selectmenu, {
    _renderItem: (ul, item) => {
      let li = $('<li/>'),
        wrapper = $('<div/>', {text: item.label});

      if (item.disabled) {
        li.addClass('ui-state-disabled');
      }

      $('<span/>', {
        style: item.element.attr('data-style'),
        "class": "ui-icon " + item.element.attr('data-class')
      })
        .appendTo(wrapper);

      return li.append(wrapper).appendTo(ul);
    }
  });

  $('#select-color')
    .iconselectmenu()
    .iconselectmenu('menuWidget')
    .addClass('ui-menu-icons customicons');
});