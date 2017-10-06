var $article = $('[data-object="help-article"]'),
  cleanUpShare = function ($list) {
    $list.children().show();
    $list.find('.link').show();
    $list.find('.short-url').remove();
  },
  fireEvent = function (action, label) {
    if (window.ga && ga.create) {
      var trackerName = ga.getAll()[0].get('name');
      ga(trackerName + '.send', 'event', 'helpcenter', action, label);
    }
  },
  hideContentByDefault = function () {
    var $drawers = $article.find('[data-behavior="help-article.contact-event"]'),
      drawer_state;

    $.each($drawers, function (idx, drawer) {
      drawer_state = $(drawer).attr('aria-expanded');

      if (drawer_state === 'false') {
        $article.find('#' + $(drawer).attr('aria-controls')).hide();
      }
    });
  };

// Hide drawer contents that should be hidden by default
hideContentByDefault();

$article.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="help-article"]'),
    behavior = $el.attr('data-behavior'),
    selected_id = $el.val(),
    $target = $('body').find('#' + $el.attr('aria-controls'));

  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    if (action.match(/^help-article/)) {
      $el.trigger(action, { el: $el, object: $object, selected_id: selected_id, target: $target });
    }
  });
});

$article.on('help-article.contact', function(event, opts) {
  event.preventDefault();
  opts.target.siblings('button').trigger('click');
  fireEvent('select', 'USAJOBS_' + window.location.pathname);
});

$article.on('help-article.contact-event', function(event, opts) {
  event.preventDefault();
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

$article.on('help-article.print', function(event, opts) {
  var article = document.getElementById('main-content').innerHTML,
    win = window.open();
    win.document.write(article);
    win.print();
    win.close();
});

$article.on('help-article.toggle-save', function(event, opts) {
  var saved_state = opts.el.attr('data-state');

  event.preventDefault();

  if (saved_state === 'is-saved') {
    opts.el.text('Save');
    opts.el.attr('data-state', 'is-unsaved');
  } else {
    opts.el.text('Saved');
    opts.el.attr('data-state', 'is-saved');
  }
});

$article.on('help-article.toggle-share', function(event, opts) {
  var target_id = opts.el.attr('id'),
    $target = opts.object.find('[aria-labeledby="' + target_id + '"]'),
    state = $target.attr('aria-hidden');

  if (state === 'true') {
    $target.attr('aria-hidden', false);
  } else {
    $target.attr('aria-hidden', true);
    cleanUpShare($target);
  }
});

$article.on('help-article.close-share', function(event, opts) {
  var target_id = opts.el.attr('data-target'),
    $target = opts.object.find(target_id),
    state = $target.attr('aria-hidden');

  if (state === 'true') {
    $target.attr('aria-hidden', false);
  } else {
    $target.attr('aria-hidden', true);
    cleanUpShare($target);
  }
});

$article.on('help-article.shorten-link', function(event, opts) {
  var base_url = 'http://go.usa.gov/api/shorten.jsonp',
    params = [
      { name: 'login', value: 'dev-usajobs' },
      { name: 'apiKey', value: '509326519e75e35f4355498bca0a31e2' }
    ],
    url_to_encode = opts.el.attr('data-shorten-url'),
    fixedEncodeURI = function(str) {
      // Reserves square brackets for IPv6 which follows RFC3986
      return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
    },
    short_url;

  event.preventDefault();

  params.push({ name: 'longUrl', value: fixedEncodeURI(url_to_encode) });

  // This should be the list that holds the share elements
  // Not really disabled but it will appear so until the result comes back
  opts.el.parent().parent().addClass('is-disabled');

  $.ajax({
    url: base_url,
    dataType: 'jsonp',
    crossdomain: true,
    data: $.param(params),
    success: function (rsp) {
      short_url = rsp.response.data.entry[0].short_url;

      // Hide other sharing options to make space to show the short URL
      $.each(opts.el.parent().siblings(), function (idx, sibling) {
        $(sibling).hide();
      });
      opts.el.after('<span class="short-url">' + short_url + '</span>');
      opts.el.hide();
      opts.el.parent().parent().removeClass('is-disabled');
    }
  });
});
