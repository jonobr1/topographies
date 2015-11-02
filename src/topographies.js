(function() {

  var root = this;
  var previousTopographies = root.Topographies || {};

  var Topographies = root.Topographies = function() {

  };

  $.extend(Topographies, {

    init: function() {
      Gibber.init();
      Topographies.Bus = new Gibberish.Bus2();
    }

  });

  $.extend(Topographies.prototype, {

  });

})();