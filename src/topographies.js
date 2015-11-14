(function() {

  var root = this;
  var previousTopographies = root.Topographies || {};

  var Topographies = root.Topographies = function() {

  };

  $.extend(Topographies, {

    Instances: [],

    Metronome: {

      elapsed: 0,

      init: function() {},

      draw: function() {

        for (var i = 0; i < Topographies.Instances.length; i++) {
          Topographies.Instances[i].update(Topographies.Metronome.elapsed);
        }

        Topographies.Metronome.elapsed++;

      }

    },

    init: function() {
      Gibber.init();
      Gibber.Clock.addMetronome(Topographies.Metronome);
      Topographies.Bus = new Bus()
        .fx.add(new Reverb({ roomSize: 1.0, damping: 0.7 }));
    },

    generateId: (function() {

      var id = 0;
      var pre = 'top-';

      return function() {
        var r = pre + id;
        id++;
        return r;
      };

    })()

  });

  $.extend(Topographies.prototype, {

  });

  var Line = Topographies.Line = function(/* instruments */) {

    var instruments = Array.prototype.slice.call(arguments, 0);
    this.instruments = {};
    this.states = [];

    for (var i = 0, state; i < instruments.length; i++) {

      if (i <= 0) {
        state = new State();
        this.states.push(state);
      }

      var instrument = instruments[i];
      instrument.id = Topographies.generateId();

      state.addProperty(instruments[i]);
      this.instruments[instrument.id] = instrument;

    }

    this.index = 0;

    Topographies.Instances.push(this);

  };

  $.extend(Line, {

  });

  $.extend(Line.prototype, {

    _index: 0,

    /**
     * In Beats
     */
    duration: 4,

    /**
     * TODO: Add a new instrument.
     */
    // addInstrument: function(o, i) {

    //   var index = typeof i === 'number' ? i : this.instruments.length;
    //   this.instruments.splice(index, 0, o);

    //   return this;

    // },

    /**
     * Add a new state.
     */
    addState: function(o, i) {


      var state = o;
      if (!(o instanceof State)) {
        state = new State(o);
      }

      var index = typeof i === 'number' ? i : this.states.length;
      this.states.splice(index, 0, state);

      this.index = index;

      return this;

    },

    /**
     * TODO: Remove an instrument by index or object.
     */
    // removeInstrument: function(i) {

    //   var instrument = null;
    //   var index;

    //   if (typeof i === 'number') {
    //     return this.instruments.splice(i, 1);
    //   } else if (!!i) {
    //     index = this.instruments.indexOf(i);
    //     if (index >= 0) {
    //       return this.instruments.splice(i, 1);
    //     }
    //   }

    //   return instrument;

    // },

    /**
     * Remove a state by index or object.
     */
    removeState: function(s) {

      var state = null;
      var index;

      if (typeof s === 'number') {
        return this.states.splice(s, 1);
      } else if (!!s) {
        index = this.states.indexOf(s);
        if (index >= 0) {
          return this.states.splice(s, 1);
        }
      }

      return state;

    },

    update: function(elapsed) {

      var pct = (elapsed % this.duration) / this.duration;
      this.index = Math.floor(pct * this.states.length);

      return this;

    },

    /**
     * For saving lines to a database.
     */
    toJSON: function() {

      return {};

    }

  });

  Object.defineProperty(Line.prototype, 'index', {

    get: function() {
      return this._index;
    },

    set: function(i) {

      if (i === this._index) {
        return this;
      }

      this._index = i;
      var state = this.states[i].values;

      for (var name in state) {
        var instrument = this.instruments[name];
        for (var prop in state[name]) {
          instrument[prop] = state[name][prop];
        }
      }

    }

  });

  var State = Topographies.State = function() {

    this.values = {};

  };

  State.Properties = ['attack', 'sustain', 'release', 'decay', 'pan', 'octave',
    'amp'];

  State.prototype.addProperty = function(object, dest) {

    var key = object.id;
    this.values[key] = {};

    if (!dest) {
      dest = object;
    }

    for (var i = 0; i < State.Properties.length; i++) {

      var name = State.Properties[i];
      if (typeof dest[name] !== 'undefined') {
        var r = dest[name];
        this.values[key][name] = typeof r === 'function' ? r.value : r;
      }

    }

    return this;

  };

})();