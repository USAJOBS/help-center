var $article = $('[data-object="help-article"]'),
  fireEvent = function (action, label) {
    window.console.log('FIRED GA event: ' + action + ' with label: ' + label);

    ga('send', {
      hitType: 'event',
      eventCategory: 'helpcenter',
      eventAction: action,
      eventLabel: label
    });
  };

$article.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="help-article"]'),
    behavior = $el.attr('data-behavior'),
    selected_id = $el.val(),
    $target = $('body').find('#' + $el.attr('aria-controls'));

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    if (action.match(/^help-article/)) {
      $el.trigger(action, { el: $el, object: $object, selected_id: selected_id, target: $target });
    }
  });
});

$article.on('help-article.contact', function(event, opts) {
  opts.target.slideDown(function () {
    opts.target.siblings('button').trigger('click');
    $('html, body').animate({
      scrollTop: opts.target.offset().top
    });
    fireEvent('select', 'USAJOBS_' + window.location.pathname);
  });
});

$article.on('help-article.contact-event', function(event, opts) {
  if (opts.el.attr('aria-expanded') === 'false') {
    fireEvent('close', 'USAJOBS_' + window.location.pathname);
  } else {
    fireEvent('open', 'USAJOBS_' + window.location.pathname);
  }
});
