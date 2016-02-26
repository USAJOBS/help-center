// Document - Object for uploading, viewing, and editing documents

var $doc = $('[data-object="document"]'),
  $doc_multiselect = $doc.find('input[type="checkbox"]'),
  $doc_singleselect = $doc.find('input[type="radio"]');

$doc.on('click', '[data-behavior]', function () {
  var $el = $(this),
    $object = $el.closest('[data-object="document"]'),
    behavior = $el.attr('data-behavior'),
    state = $object.attr('data-state'),
    $target = $object.find($el.attr('data-target'));

  // DO NOT preventDefault here otherwise we will
  // unintentionally disable form elements
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, state: state, target: $target });
  });
});

$doc.on('document.toggle', function(event, opts) {
  event.preventDefault();

  if (opts.state !== 'is-disabled') {
    opts.target.trigger('click');
  }
});

$doc.on('document.select', function(event, opts) {
  event.preventDefault();

  if (opts.state !== 'is-disabled') {
    opts.target.trigger('click');
  }
});

$doc_singleselect.on('change', function() {
  var $input = $(this),
    $object = $input.parent().closest('[data-object="document"]'),
    $sibling_inputs = $(document).find('input[type="radio"][name="' + $input.attr('name') + '"]'),
    $sibling_objects = $sibling_inputs.not('#' + $input.attr('id')).parent().closest('[data-object="document"]');

  if ($input.is(':checked')) {
    $object.attr('data-state', 'is-selected');
    $sibling_objects.attr('data-state', 'is-selectable');
  } else {
    $object.attr('data-state', 'is-selectable');
  }
});

$doc_multiselect.on('change', function() {
  var $input = $(this),
    $object = $input.parent().closest('[data-object="document"]');

  if ($input.is(':checked')) {
    $object.attr('data-state', 'is-selected');
  } else {
    $object.attr('data-state', 'is-selectable');
  }
});

// Footer

var $footer = $('[data-object="footer"]'),
  window_width = window.innerWidth;

$footer.on('click', '[data-behavior]', function () {
  var $el = $(this),
    $object = $el.closest('[data-object="footer"]'),
    state = $el.attr('data-state'),
    behavior = $el.attr('data-behavior'),
    $target = $object.find($el.attr('data-target'));

  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $object.trigger(action, { el: $el, object: $object, state: state, target: $target });
  });
});

$footer.on('footer.toggle', function(event, opts) {
  event.preventDefault();

  if (opts.state === 'is-closed') {
    opts.object.trigger('footer.open', opts);
  } else if (opts.state === 'is-open') {
    opts.object.trigger('footer.close', opts);
  }
});

$footer.on('footer.open', function(event, opts) {
    // Hide all siblings
    /*
    opts.object
      .find('[data-behavior="footer.toggle"][data-state="is-open"]')
      .trigger('close', { });
    */

  opts.target.removeClass('is-hidden');
  opts.target.attr('aria-expanded', 'true');
  opts.el.attr('aria-expanded', 'true');
  opts.el.attr('data-state', 'is-open');
});

$footer.on('footer.close', function(event, opts) {
  if (window_width < 600) {
    event.preventDefault();

    opts.target.addClass('is-hidden');
    opts.target.attr('aria-expanded', 'false');
    opts.el.attr('aria-expanded', 'false');
    opts.el.attr('data-state', 'is-closed');
  }
});

// Modal

var $modal = $('[data-object="modal"]'),
  $modal_trigger = $('[data-object-trigger="modal"]'),
  $body = $('body'),
  $backdrop = $('<div class="usajobs-modal__canvas-blackout" tabindex="-1" />');

$modal_trigger.on('click', function (event) {
  var $el = $(this),
    $this_modal = $body.find($el.attr('data-target')),
    state = $this_modal.attr('data-state'),
    transition_to;

  event.preventDefault();

  if (state === 'is-closed') {
    transition_to = 'modal.open';
  } else {
    transition_to = 'modal.close';
  }

  $this_modal.trigger(transition_to, { el: $el, object: $this_modal, state: state });
});

$modal.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="modal"]'),
    state = $object.attr('data-state'),
    behavior = $el.attr('data-behavior');

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, state: state });
  });
});

$modal.on('modal.open', function(event, opts) {
  var closeModal = function () {
    opts.object.trigger('modal.close', {
      el: opts.el,
      object: opts.object,
      state: opts.state
    });
  };

  event.preventDefault();

  $body.addClass('is-open-modal');
  $backdrop
    .appendTo($body)
    .attr('aria-hidden', 'true');

  // Store the element on the page that had focus
  // so we can return focus to that element
  opts.object.data('previous_focus', $(':focus'));

  opts.object.attr('data-state', 'is-open');
  opts.object.attr('aria-hidden', 'false');

  $(document).on('keyup', function (e) {
    // Close the modal when ESC is pressed
    if (e.keyCode === 27) {
      closeModal();
    }
  });

});

$modal.on('modal.close', function(event, opts) {
  $body.removeClass('is-open-modal');
  $backdrop.remove();

  $(document).off('keyup');

  opts.object.attr('data-state', 'is-closed');
  opts.object.attr('aria-hidden', 'true');
  opts.object.data('previous_focus').focus();
});

// Secondary Nav

var $nav_secondary = $('[data-object="nav-secondary"]'),

  // The majority of this function is used courtesty of
  // Brad Frost's responsive design patterns:
  // https://bradfrost.github.io/this-is-responsive/patterns.html
  // Specifically, the Priority+ Alt pattern.
  navSecondaryToggleMenuItems = function () {
    var nav_width = 0,
      $menu = $nav_secondary.find('.usajobs-nav-secondary__menu'),
      $more_menu = $menu.find('.more'),
      $more_container = $nav_secondary.find($nav_secondary.attr('data-target')),
      more_width = $more_menu.outerWidth(true),
      available_space,
      last_item,
      first_more_el;

    $menu.find('> li:not(.more)').each(function () {
      nav_width += $(this).outerWidth( true );
    });

    available_space = $nav_secondary.outerWidth(true) - more_width;

    if (nav_width > available_space) {
      last_item = $menu.find('> li:not(.more)').last();
      last_item.attr('data-width', last_item.outerWidth(true));
      last_item.prependTo($more_container);
      navSecondaryToggleMenuItems();
    } else {
      first_more_el = $more_menu.find('li').first();

      if (nav_width + first_more_el.data('width') < available_space) {
        first_more_el.insertBefore($more_menu);
      }
    }

    if ($more_menu.find('li').length > 0) {
      $more_menu.css('display','inline-block');
    } else {
      $more_menu.css('display','none');
    }
  };

// Toggle Secondary Nav items on load
if ($nav_secondary !== undefined && $nav_secondary.length > 0) {
  navSecondaryToggleMenuItems();
}

// Toggle Secondary Nav items on resize
$(window).resize( $.throttle( 250, function() {
  if ($nav_secondary !== undefined && $nav_secondary.length > 0) {
    navSecondaryToggleMenuItems();
  }
}));

$nav_secondary.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="nav-secondary"]'),
    behavior = $el.attr('data-behavior'),
    $target = $object.find($object.attr('data-target')),
    state = $target.attr('data-state');

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, state: state, target: $target });
  });
});

$nav_secondary.on('nav-secondary.toggle', function(event, opts) {
  event.preventDefault();

  if (opts.state === 'is-closed') {
    opts.object.trigger('nav-secondary.open', opts);
  } else if (opts.state === 'is-open') {
    opts.object.trigger('nav-secondary.close', opts);
  }
});

$nav_secondary.on('nav-secondary.open', function(event, opts) {
  opts.target.attr('data-state', 'is-open');
});

$nav_secondary.on('nav-secondary.close', function(event, opts) {
  opts.target.attr('data-state', 'is-closed');
});

// Navigation (top-level-nav)

var $nav = $('[data-object="nav"]');

$nav.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="nav"]'),
    state = $object.attr('data-state'),
    behavior = $el.attr('data-behavior'),
    $target = $object.find($object.attr('data-target'));

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, state: state, target: $target });
  });
});

$nav.on('nav.toggle', function(event, opts) {
  event.preventDefault();

  if (opts.state === 'is-closed') {
    opts.object.trigger('nav.open', opts);
  } else if (opts.state === 'is-open') {
    opts.object.trigger('nav.close', opts);
  }
});

$nav.on('nav.open', function(event, opts) {
  opts.object.attr('data-state', 'is-open');
  opts.target.slideToggle(300, function () {
    opts.el.attr('aria-expanded', 'true');
    opts.target.attr('aria-expanded', 'true');
  });
});

$nav.on('nav.close', function(event, opts) {
  opts.object.attr('data-state', 'is-closed');
  opts.target.slideToggle(300, function () {
    opts.el.attr('aria-expanded', 'false');
    opts.target.attr('aria-expanded', 'false');
  });
});

$nav.on('nav.menu.toggle', function(event, opts) {
  var $parent = opts.el.parent(),
    parent_state = $parent.attr('data-state'),
    $menu = $parent.find('[role="menu"]'),
    $sibling = $parent.siblings().find('[aria-expanded="true"]');

  event.preventDefault();

  $nav.trigger('nav.menu.slide-close', { parent: $sibling.parent(), menu: $sibling });

  if (parent_state === 'is-closed') {
    $nav.trigger('nav.menu.slide-open', { parent: $parent, menu: $menu });
  } else if (parent_state === 'is-open') {
    $nav.trigger('nav.menu.slide-close', { parent: $parent, menu: $menu });
  }
});

$nav.on('nav.menu.slide-open', function(event, opts) {
  opts.parent.attr('data-state', 'is-open');
  opts.menu.slideDown(300, function () {
    opts.menu.attr('aria-expanded', 'true');
  });
});

$nav.on('nav.menu.slide-close', function(event, opts) {
  opts.parent.attr('data-state', 'is-closed');
  opts.menu.slideUp(300, function () {
    opts.menu.attr('aria-expanded', 'false');
  });
});

$nav.on('nav.menu.search-toggle', function(event, opts) {
  var $parent = opts.el.parent(),
    parent_state = $parent.attr('data-state'),
    $menu = $nav.find($parent.attr('data-target'));

  event.preventDefault();

  if (parent_state === 'is-closed') {
    $nav.trigger('nav.menu.slide-open', { parent: $parent, menu: $menu });
  } else if (parent_state === 'is-open') {
    $nav.trigger('nav.menu.slide-close', { parent: $parent, menu: $menu });
  }
});


// Search autocomplete locations
var acHostUrl = 'https://ac.usajobs.gov/acwd',
usajSrc = function (request, response) {
  $.ajax({
    url: acHostUrl,
    dataType: 'jsonp',
    crossdomain: true,
    cache: true,
    jsonpCallback: 'usaj151067976',
    data: { t: request.term },
    success: function (data) {
      response(data);
    }
  });
};

$( '#search-location-v2' ).autocomplete({
  source: usajSrc,
  minLength: 3,
  select: function (event, ui) {
    var selectedObj = ui.item;

    $('#search-location-v2').val(selectedObj.label);
    $('#AutoCompleteSelected').val('true');
    return false;
  },
  search: function () {
    //wipe out values on new searches or when user selects one but changes their mind!
    $('#AutoCompleteSelected').val('false');
  }
});

$( '#search-keyword-v2' ).autocomplete({
  minLength: 3,
  source: [ 'Nurse', 'Nurse Anesthetists', 'Nurse Anesthetists AND intubation']
});

// Notification

var $notification = $('[data-object="notification"]'),
  $notification_trigger = $('[data-object-trigger="notification"]'),
  $body = $('body');

$notification_trigger.on('click', function (event) {
  var $el = $(this),
    $this_notification = $body.find($el.attr('data-target')),
    state = $this_notification.attr('data-state'),
    transition_to;

  event.preventDefault();

  if (state === 'is-closed') {
    transition_to = 'notification.open';
  } else {
    transition_to = 'notification.close';
  }

  $this_notification.trigger(transition_to, { el: $el, object: $this_notification, state: state });
});

$notification.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="notification"]'),
    state = $object.attr('data-state'),
    behavior = $el.attr('data-behavior');

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, state: state });
  });
});

$notification.on('notification.open', function(event, opts) {
  event.preventDefault();

  opts.object.attr('data-state', 'is-open');
  opts.object.attr('aria-hidden', 'false');

  opts.object.trigger('notification.delayed-close', {
    el: opts.el,
    object: opts.object,
    state: opts.state
  });
});

$notification.on('notification.close', function(event, opts) {
  opts.object.attr('data-state', 'is-closed');
  opts.object.attr('aria-hidden', 'true');
});

$notification.on('notification.delayed-close', function(event, opts) {
  setTimeout(function () {
    opts.object.attr('data-state', 'is-closed');
    opts.object.attr('aria-hidden', 'true');
  }, 5000);
});


/*! politespace - v0.1.5 - 2015-07-09
Politely add spaces to input values to increase readability (credit card numbers, phone numbers, etc).
 * https://github.com/filamentgroup/politespace
 * Copyright (c) 2015 Filament Group (@filamentgroup)
 * MIT License */
// TODO when moving to import system, install this with npm install politespace
(function( w ){
  'use strict';

  var Politespace = function( element ) {
    if( !element ) {
      throw new Error('Politespace requires an element argument.');
    }

    if( !element.getAttribute ) {
      // Cut the mustard
      return;
    }

    this.element = element;
    this.type = this.element.getAttribute( 'type' );
    this.delimiter = this.element.getAttribute( 'data-delimiter' ) || ' ';
    // https://en.wikipedia.org/wiki/Decimal_mark
    this.decimalMark = this.element.getAttribute( 'data-decimal-mark' ) || '';
    this.reverse = this.element.getAttribute( 'data-reverse' ) !== null;
    this.groupLength = this.element.getAttribute( 'data-grouplength' ) || 3;
  };

  Politespace.prototype._divideIntoArray = function( value ) {
    var split = ( '' + this.groupLength ).split( ',' ),
      isUniformSplit = split.length === 1,
      dividedValue = [],
      loopIndex = 0,
      groupLength,
      substrStart,
      useCharCount;

    while( split.length && loopIndex < value.length ) {
      if( isUniformSplit ) {
        groupLength = split[ 0 ];
      } else {
        // use the next split or the rest of the string if open ended, ala "3,3,"
        groupLength = split.shift() || value.length - loopIndex;
      }

      // Use min if we’re at the end of a reversed string
      // (substrStart below grows larger than the string length)
      useCharCount = Math.min( parseInt( groupLength, 10 ), value.length - loopIndex );

      if( this.reverse ) {
        substrStart = -1 * (useCharCount + loopIndex);
      } else {
        substrStart = loopIndex;
      }
      dividedValue.push( value.substr( substrStart, useCharCount ) );
      loopIndex += useCharCount;
    }

    if( this.reverse ) {
      dividedValue.reverse();
    }

    return dividedValue;
  };

  Politespace.prototype.format = function( value ) {
    var split,
      val = this.unformat( value ),
      suffix = '';

    if( this.decimalMark ) {
      split = val.split( this.decimalMark );
      suffix = split.length > 1 ? this.decimalMark + split[ 1 ] : '';
      val = split[ 0 ];
    }

    return this._divideIntoArray( val ).join( this.delimiter ) + suffix;
  };

  Politespace.prototype.trimMaxlength = function( value ) {
    var maxlength = this.element.getAttribute('maxlength');
    // Note input type="number" maxlength does nothing
    if( maxlength ) {
      value = value.substr( 0, maxlength );
    }
    return value;
  };

  Politespace.prototype.getValue = function() {
    return this.trimMaxlength( this.element.value );
  };

  Politespace.prototype.update = function() {
    this.element.value = this.useProxy() ? this.getValue() : this.format( this.getValue() );
  };

  Politespace.prototype.unformat = function( value ) {
    return value.replace( new RegExp(  this.delimiter, 'g' ), '' );
  };

  Politespace.prototype.reset = function() {
    this.element.value = this.unformat( this.element.value );
  };

  Politespace.prototype.useProxy = function() {
    return this.type === 'number';
  };

  Politespace.prototype.updateProxy = function() {
    var proxy;
    if( this.useProxy() ) {
      proxy = this.element.parentNode.firstChild;
      proxy.innerHTML = this.format( this.getValue() );
      proxy.style.width = this.element.offsetWidth + 'px';
    }
  };

  Politespace.prototype.createProxy = function() {
    if( !this.useProxy() ) {
      return;
    }

    function getStyle( el, prop ) {
      return window.getComputedStyle( el, null ).getPropertyValue( prop );
    }

    function sumStyles( el, props ) {
      var total = 0,
        j;

      for (j=0, k=props.length; j<k; j++ ) {
        total += parseFloat( getStyle( el, props[ j ] ) );
      }

      return total;
    }

    var parent = this.element.parentNode,
      el = document.createElement('div'),
      proxy = document.createElement('div'),
      formEl;

    proxy.style.font = getStyle(this.element, 'font');
    proxy.style.paddingLeft = sumStyles( this.element, [ 'padding-left', 'border-left-width' ] ) + 'px';
    proxy.style.paddingRight = sumStyles( this.element, [ 'padding-right', 'border-right-width' ] ) + 'px';
    proxy.style.top = sumStyles( this.element, [ 'padding-top', 'border-top-width', 'margin-top' ] ) + 'px';

    el.appendChild( proxy );
    el.className = 'politespace-proxy active';
    formEl = parent.replaceChild( el, this.element );
    el.appendChild( formEl );

    this.updateProxy();
  };

  w.Politespace = Politespace;

}( this ));

(function( $ ) {
  'use strict';

  // jQuery Plugin

  var componentName = 'politespace';

  $.fn[ componentName ] = function(){
    return this.each( function(){
      var polite = new Politespace( this );

      if( polite.type === 'number' ) {
        polite.createProxy();
      }

      $(this)
        .bind('input keydown', function() {
          polite.updateProxy();
        })
        .bind('blur', function() {
          $(this).closest('.politespace-proxy').addClass('active');
          polite.update();
          polite.updateProxy();
        })
        .bind('focus', function() {
          $(this).closest('.politespace-proxy').removeClass('active');
          polite.reset();
        })
        .data( componentName, polite );

      polite.update();
    });
  };

  // auto-init on enhance (which is called on domready)
  $(document).ready(function() {
    $('[data-' + componentName + ']').politespace();
  });

}( jQuery ));

/**
 * Accordion
 *
 * An accordion component.
 *
 * @param {jQuery} $el A jQuery html element to turn into an accordion.
 */
function Accordion($el) {
  var self = this;
  this.$root = $el;
  this.$root.on('click', 'button', function(ev) {
    var expanded = JSON.parse($(this).attr('aria-expanded'));
    ev.preventDefault();
    self.hideAll();
    if (!expanded) {
      self.show($(this));
    }
  });
}

Accordion.prototype.$ = function(selector) {
  return this.$root.find(selector);
};

Accordion.prototype.hide = function($button) {
  var selector = $button.attr('aria-controls'),
      $content = this.$('#' + selector);

  $button.attr('aria-expanded', false);
  $content.attr('aria-hidden', true);
};

Accordion.prototype.show = function($button) {
  var selector = $button.attr('aria-controls'),
      $content = this.$('#' + selector);

  $button.attr('aria-expanded', true);
  $content.attr('aria-hidden', false);

  $('html, body').animate({
    scrollTop: $content.offset().top
  });
};

Accordion.prototype.hideAll = function() {
  var self = this;
  this.$('button').each(function() {
    self.hide($(this));
  });
};

/**
 * accordion
 *
 * Initialize a new Accordion component.
 *
 * @param {jQuery} $el A jQuery html element to turn into an accordion.
 */
function accordion($el) {
  return new Accordion($el);
}

function toggleFieldMask($field, showing) {
  $field.attr('autocapitalize', 'off');
  $field.attr('autocorrect', 'off');
  $field.attr('type', showing ? 'password' : 'text');
}

function togglePassword($el) {
  var fieldSelector =  '#' + $el.attr('aria-controls'),
      $field = $el.parents('form').find(fieldSelector),
      showing = false;

  $el.on('click', function(ev) {
    ev.preventDefault();
    toggleFieldMask($field, showing);
    $el.text(showing ? 'Show password' : 'Hide password');
    showing = !showing;
  });
}

function toggleSSN($el) {
  var fieldSelector =  '#' + $el.attr('aria-controls'),
      $field = $el.parents('form').find(fieldSelector),
      showing = false;

  $el.on('click', function(ev) {
    ev.preventDefault();
    toggleFieldMask($field, showing);
    $el.text(showing ? 'Show SSN' : 'Hide SSN');
    showing = !showing;
  });
}

function toggleMultiPassword($el) {
  var fieldSelector = '#password, #confirmPassword',
      $fields = $el.parents('form').find(fieldSelector),
      showing = false;

  $el.on('click', function(ev) {
    ev.preventDefault();
    toggleFieldMask($fields, showing);
    $el.text(showing ? 'Show my typing' : 'Hide my typing');
    showing = !showing;
  });
}

function validator($el) {
  var data = $('#password[data-validation-element]').data(),
      validatorName,
      validatorPattern,
      $validatorCheckbox,
      $checkList = $($el.data('validationElement'));

  function validate() {
    var key;

    for (key in data) {
      if (key.startsWith('validate')) {
        validatorName = key.split('validate')[1];
        validatorPattern = new RegExp(data[key]);
        $validatorCheckbox = $checkList.find('[data-validator=' +
            validatorName.toLowerCase() + ']');

        if (!validatorPattern.test($el.val())) {
          $validatorCheckbox.toggleClass('usa-checklist-checked', false);
        }
        else {
          $validatorCheckbox.toggleClass('usa-checklist-checked', true);
        }
      }
    }
  }

  $el.on('keyup', validate);
}

$(function() {
  $('[class^=usa-accordion]').each(function() {
    accordion($(this));
  });

  // Fixing skip nav focus behavior in chrome
  $('.skipnav').click(function(){
    $('#main-content').attr('tabindex','0');
  });

  $('#main-content').blur(function(){
    $(this).attr('tabindex','-1');
  });

  togglePassword($('.usa-show_password'));
  toggleMultiPassword($('.usa-show_multipassword'));
  toggleSSN($('.usa-show_ssn'));
  validator($('.js-validate_password'));

});
