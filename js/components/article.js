var $article = $('[data-object="help-article"]');

$article.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="help-article"]'),
    behavior = $el.attr('data-behavior'),
    selected_id = $el.val(),
    $target = $object.find('#' + $el.attr('aria-controls'));

  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    if (action.match(/^help/)) {
      $el.trigger(action, { el: $el, object: $object, selected_id: selected_id, target: $target });
    }
  });
});

$article.on('help-article.contact', function(event, opts) {
  event.preventDefault();

  opts.target.slideDown(function () {
    opts.target.siblings('button').trigger('click');
    $('html, body').animate({
      scrollTop: opts.target.offset().top
    });
  });
});
