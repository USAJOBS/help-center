// Search autocomplete locations
function TermsHighlighter(s, t) {
  var splitString = t.split(" ");
  for (var i = 0; i < splitString.length; i++) {
    if (splitString[i] !== "") {
      var matcher = new RegExp("(" + $.ui.autocomplete.escapeRegex(splitString[i]) + ")", "ig");
      s = s.replace(matcher, "<strong>$1</strong>");
    }
  }
  return s;
}

function splitTermHighlighter(s, t) {
  var splitString = t.split(" ").sort(function(a, b) { return b.length - a.length; }),
    matcherString = "";

  for (var i = 0; i < splitString.length; i++) {
    if (splitString[i] !== "") {
      matcherString = matcherString + "(" + $.ui.autocomplete.escapeRegex(splitString[i]) + ")|";
    }
  }

  var matcher = new RegExp(matcherString, "ig");
  s = s.replace(matcher, "<strong>$&</strong>");

  return s;
}

var HelpURLHelper = { DataConfig: "https://data.usajobs.gov" };
//{{ReplaceURLHelper}}

// Search autocomplete
var $location = $('#uhp-location'),
  $keyword = $('#uhp-keyword'),
  $keyword_param = $('#uhp-keyword-param'),
  $search_form = $('#uhp-search'),
  handleLocationReturn = function () {
    $location.keypress(function (event) {
      if (event.which == 13) {
        closeLocationAutocomplete();
        $search_form.submit();
      }
    });
  },
  closeKeywordAutocomplete = function () {
    $keyword.keywordcomplete('close');
    $keyword.blur(); // unfocus the input so the keyboard will close
  };
  closeLocationAutocomplete = function () {
    $location.catcomplete('close');
    $location.blur(); // unfocus the input so the keyboard will close
  };

handleLocationReturn();

$.widget("custom.catcomplete", $.ui.autocomplete, {
  _create: function() {
    this._super();
    this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
  },
  _renderMenu: function(ul, items) {
    var that = this,
      currentCategory = "";

    ul.addClass("usajobs-search-location-autocomplete");

    $.each(items, function(index, item) {
      var li;

      item.value = item.Name;
      item.label = item.Name;
      item.category = item.Type;

      if (item.category != currentCategory) {
        ul.append('<li class="ui-autocomplete-category ' + item.category + '">' + item.category + '</li>');
        currentCategory = item.category;
      }
      li = that._renderItemData( ul, item );
      if (item.category) {
        li.attr("aria-label", item.category + " : " + item.label);
      }
    });
  },
  _renderItem: function (ul, item) {
     return $("<li>")
     .addClass(item.type)
     .attr("data-value", item.value)
     .append($("<a>").html(item.label))
     .appendTo(ul);
  }
});

$.widget("custom.keywordcomplete", $.ui.autocomplete, {
    _create: function () {
        this._super();
        this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
    },
    _renderMenu: function (ul, items) {
        ul.addClass("usajobs-search-keyword-autocomplete");
        var that = this,
            currentCategory = "",
            header = '<li class="ui-autocomplete-close-header">Close &nbsp;&nbsp;&times;</li>',
            $header = $(header);

        $.each(items, function (index, item) {
            var li;
            if (item.type != currentCategory) {
                ul.append('<li class="ui-autocomplete-category ' + item.type + ' ">' + item.type + '</li>');
                currentCategory = item.type;
            }
            li = that._renderItemData(ul, item);
            if (item.Type) {
                li.attr("aria-label", item.type + " : " + item.value);
            }
        });
    },
    _renderItem: function (ul, item) {
        return $("<li>")
        .addClass(item.type)
        .attr("data-value", item.value)
        .append($("<a>").html(item.label))
        .appendTo(ul);
    }
});

var url = 'https://ac.usajobs.gov/locationAC',
  autocompleteRequest = function (request, response) {
    $.ajax({
      url: url,
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

var keywordautocompleterequest = function (request, response) {
  $.ajax({
    url: HelpURLHelper.DataConfig + "/api/Autocomplete/Keyword",
    dataType: "json",
    crossdomain: true,
    cache: true,
    data: { term: request.term },
    success: function (data) {
      var results = [];

      for (var key in data) {
        for (var i = 0; i < data[key].length; i++) {
          var label = data[key][i].Name,
            code = data[key][i].Code,
            parentName = "";

          if (key == "series") {
            label = code + " - " + data[key][i].Name;
          } else if (key == "occupations") {
            code = data[key][i].Name;
          }

          if (data[key][i].hasOwnProperty('Acronym')) {
            label = label + " (" + data[key][i].Acronym.toUpperCase() + ")";
          }

          if (data[key][i].hasOwnProperty('ParentName')) {
            label = label + " - " + data[key][i].ParentName;
            parentName = data[key][i].ParentName;
          }

          var autocompleteItem = {
            value: label,
            label: splitTermHighlighter(label, request.term),
            type: key,
            actualValue: code,
            parentName: parentName
          };

          results.push(autocompleteItem);
        }
      }
      response(results);
    },
    global: false
  });
};

$location.catcomplete({
  appendTo: "#search-inner-autocomplete-container",
  source: autocompleteRequest,
  minLength: 2,
  open: function () {
    var data = $(this).data('custom-catcomplete');

    $("ul.ui-menu").width($(this).innerWidth());

    $location.off('menufocus hover mouseover mouseenter');

    data
      .menu
      .element
      .find('li a')
      .each(function () {
        var $me = $(this),
          keywords = data.term.split(' ').join('|');

        $me.addClass("ui-corner-all");
        $me.html($me.text().replace(new RegExp('(' + keywords + ')', 'gi'), '<strong>$1</strong>'));
      });
  },
  select: function (event, ui) {
    var selected = ui.item,
      field_name,
      pill_name,
      $hidden_cities = $('<input type="hidden" name="locations[]"></input>'),
      $hidden_states = $('<input type="hidden" name="states[]"></input>'),
      $hidden_countries = $('<input type="hidden" name="countries[]"></input>'),
      value = selected.label.split(' (')[0]; // Removes the acronym

    if (selected.Type === 'Cities') {
      field_name = 'locations';
      pill_name = field_name + '-' + Date.now(); // This is a hacky way to get a unique ID

      // Add hidden field so entry sticks around
      $hidden_cities
        .attr('id', pill_name)
        .attr('value', value);

      $hidden_cities.appendTo($search_form);
    } else if (selected.Type === 'States') {
      field_name = 'states';
      pill_name = field_name + '-' + Date.now(); // This is a hacky way to get a unique ID

      // Add hidden field so entry sticks around
      $hidden_states
        .attr('id', pill_name)
        .attr('value', value);

      $hidden_states.appendTo($search_form);
    } else if (selected.Type === 'Countries') {
      field_name = 'countries';
      pill_name = field_name + '-' + Date.now(); // This is a hacky way to get a unique ID

      // Add hidden field so entry sticks around
      $hidden_countries
        .attr('id', pill_name)
        .attr('value', value);

      $hidden_countries.appendTo($search_form);
    }

    logLocationAC(value);
    $location.val(value);
    closeLocationAutocomplete();

    return false;
  }
});

$keyword.keywordcomplete({
  source: keywordautocompleterequest,
  minLength: 2,
  select: function (event, ui) {
    var selectedObj = ui.item,
      parameter = "";

    switch (selectedObj.type) {
      case "series":
        parameter = selectedObj.parentName !== "" ? "j" : "jf";
        break;
      case "agencies":
        parameter = "a";
        break;
      case "departments":
        parameter = "d";
        break;
      case "occupations":
        parameter = "soc";
        break;
      case "series":
        parameter = "j";
        break;
      case "job titles":
        parameter = "jt";
        break;
      }

    logKeywordAC(selectedObj.value);
    $keyword.val(selectedObj.value);
    $keyword_param.attr('name', parameter).val(selectedObj.actualValue);
    closeKeywordAutocomplete();

    return false;
  },
  open: function () {
    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    $("ul.ui-menu").width($(this).innerWidth());
  },
  close: function () {
     $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
  }
});
