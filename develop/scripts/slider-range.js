$(document).ready(() => {
  $('.slider-range').slider({
    range: true,
    min: 0,
    max: 700,
    values: [52, 400],
    slide: (event, ui) => {
      $('.filter-range-min').text("$" + ui.values[0]);
      $('.filter-range-max').text("$" + ui.values[1]);
    }
  });
});