var $article = $('[data-object="help-article"]'),
  fireEvent = function (action, label) {
    if (window.ga && ga.create) {
      var trackerName = ga.getAll()[0].get('name');
      ga(trackerName + '.send', 'event', 'helpcenter', action, label);
    }
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
  opts.target.siblings('button').trigger('click');
  fireEvent('select', 'USAJOBS_' + window.location.pathname);
});

$article.on('help-article.contact-event', function(event, opts) {
  if (opts.el.attr('aria-expanded') === 'false') {
    opts.target.slideUp(function () {
      $('html, body').animate({
        scrollTop: opts.object.offset().top
      });
    });

    fireEvent('close', 'USAJOBS_' + window.location.pathname);
  } else {
    opts.target.slideDown(function () {
      $('html, body').animate({
        scrollTop: opts.target.offset().top
      });
    });
    
    fireEvent('open', 'USAJOBS_' + window.location.pathname);
  }
});
