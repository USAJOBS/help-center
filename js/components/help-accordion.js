var $help_accordion = $('[data-object="help-accordion"]'),
  hideContentByDefault = function() {
    var $drawers = $help_accordion.find(
        '[data-behavior="help-accordion.toggle"]'
      ),
      drawer_state;

    $.each($drawers, function(idx, drawer) {
      drawer_state = $(drawer).attr("aria-expanded");

      if (drawer_state === "false") {
        $help_accordion
          .find("#" + $(drawer).attr("aria-controls"))
          .attr("aria-hidden", "true");
      }
    });
  };

// Hide drawer contents that should be hidden by default
hideContentByDefault();

$help_accordion.on("click", "[data-behavior]", function(event) {
  var $el = $(this),
    $object = $el.closest('[data-object="help-accordion"]'),
    behavior = $el.attr("data-behavior"),
    $target = $object.find("#" + $el.attr("aria-controls")),
    state = $target.attr("aria-hidden");

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(" "), function(idx, action) {
    if (action.match(/^help/)) {
      $el.trigger(action, {
        el: $el,
        object: $object,
        target: $target,
        state: state
      });
    }
  });
});

$help_accordion.on("help-accordion.toggle", function(event, opts) {
  event.preventDefault();

  if (opts.state === "true") {
    opts.target.slideDown(function() {
      opts.el.attr("aria-expanded", "true");
      opts.object
        .find(
          '.usa-accordion-content[aria-hidden="true"][style="display: block;"]'
        )
        .removeAttr("style");

      $("html, body").animate(
        {
          scrollTop: opts.object.offset().top
        },
        300,
        function() {
          opts.target.attr("aria-hidden", "false");
        }
      );
    });
  } else {
    opts.target.slideUp(function() {
      opts.el.attr("aria-expanded", "false");
      $("html, body").animate(
        {
          scrollTop: opts.object.offset().top
        },
        300,
        function() {
          opts.target.attr("aria-hidden", "true");
          // Ensure siblings that are clicked don't get out of sync
        }
      );
    });
  }
});
