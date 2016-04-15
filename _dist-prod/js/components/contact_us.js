var $help = $('[data-object="help.contact_us"]');

$help.on('change', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="help.contact_us"]'),
    behavior = $el.attr('data-behavior'),
    selected_id = $el.val(),
    $target = $object.find('#' + $el.attr('aria-controls'));

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, selected_id: selected_id, target: $target });
  });
});

$help.on('help.open', function(event, opts) {
  var $send_button = $('#btn-send'),
    $all_topics = opts.target.find('.usajobs-help-topic'),
    $target_topics = opts.target.find('.' + opts.selected_id);

  event.preventDefault();

  opts.target.attr('aria-hidden', 'false');
  $all_topics.attr('aria-hidden', 'true');
  $target_topics.attr('aria-hidden', 'false');

  // Show optional fields for login/password
  if (opts.selected_id === '13') {
    opts.object.find('#contactOptionalData').attr('aria-hidden', 'false');
  }

  // Enabled the send button
  $send_button.removeAttr('disabled');
});
