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
    ul.addClass("usajobs-search-location-autocomplete");
    var that = this,
      currentCategory = "",
      header = '<li class="ui-autocomplete-close-header">Close &nbsp;&nbsp;&times;</li>',
      $header = $(header);
    $.each(items, function(index, item) {
      var li;
      if (item.type != currentCategory) {
        ul.append('<li class="ui-autocomplete-category ' + item.type + '">' + item.type + '</li>');
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

var autocompleteRequest = function (request, response) {
    $.ajax({
      url: HelpURLHelper.DataConfig + "/api/Autocomplete/Location",
      dataType: 'json',
      crossdomain: true,
      cache: true,
      data: { term: request.term },
      success: function (data) {
        var results = [];

        for (var key in data) {
            for (var i = 0; i < data[key].length; i++) {
                var label = data[key][i].Name;
                var code = data[key][i].Code;
                var parentName = "";

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
  source: autocompleteRequest,
  minLength: 2,
  select: function (event, ui) {
      var selectedObj = ui.item;
      logLocationAC(selectedObj.value);
      $location.val(selectedObj.value);
      closeLocationAutocomplete();

      return false;
  },
  open: function () {
      $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
      $("ul.ui-menu").width($(this).innerWidth());
  },
  close: function() {
      $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
  }
});

$keyword.keywordcomplete({
  source: keywordautocompleterequest,
  minLength: 2,
  select: function (event, ui) {
    var selectedObj = ui.item,
        parameter = "",
        hiringPath = $('input[name=hp]').val();
    switch (selectedObj.type) {
        case "series":
            parameter = "" !== selectedObj.parentName ? "j" : "jf";
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
    }
    logKeywordAC(selectedObj.value);
    location.href = '/search?' + parameter + '=' + selectedObj.actualValue + '&hp=' + hiringPath;

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
