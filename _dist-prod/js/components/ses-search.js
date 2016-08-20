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

// Portions of this code came from http://jsfiddle.net/fozylet/kTAMm/
$('.usajobs-ses-search #Location').autocomplete({
  source: usajSrc,
  minLength: 3,
  open: function (e, ui) {
    var acData = $(this).data('ui-autocomplete');
    acData
      .menu
      .element
      .find('li')
      .each(function () {
        var me = $(this);
        var keywords = acData.term.split(' ').join('|');
        me.html(me.text().replace(new RegExp("(" + keywords + ")", "gi"), '<strong>$1</strong>'));
      });
  },
  select: function (event, ui) {
    var selectedObj = ui.item;

    $('.usajobs-ses-search #Location').val(selectedObj.label);
    $('#ses-AutoCompleteSelected').val('true');
    return false;
  },
  search: function () {
    //wipe out values on new searches or when user selects one but changes their mind!
    $('#ses-AutoCompleteSelected').val('false');
  }
});
