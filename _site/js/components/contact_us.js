var $help = $('[data-object="help.contact_us"]');

$help.on('change', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="help.contact_us"]'),
    behavior = $el.attr('data-behavior'),
    $target = $object.find('#' + $el.attr('aria-controls'));

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, target: $target });
  });
});

$help.on('help.open', function(event, opts) {
  event.preventDefault();

  opts.target.attr('aria-hidden', 'false');
});
