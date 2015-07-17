(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var Bacon, propsOrStateProperty;

Bacon = (global || window).Bacon;

if (typeof module !== "undefined" && module !== null) {
  module.exports = Bacon;
}

Bacon.BaconMixin = {
  isEqual: function(a, b) {
    var i, key, keys, len;
    if (a === b) {
      return true;
    }
    if (!((a != null) && (b != null))) {
      return false;
    }
    keys = Object.keys(a);
    if (keys.length !== (Object.keys(b)).length) {
      return false;
    }
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      if (a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  },
  propsProperty: function(propName) {
    return propsOrStateProperty(this, 'allProps', 'props', propName);
  },
  stateProperty: function(stateName) {
    return propsOrStateProperty(this, 'allState', 'state', stateName);
  },
  eventStream: function(eventName) {
    var bacon, bus, buses;
    bacon = this._bacon || (this._bacon = {});
    buses = bacon['buses.events'] = bacon['buses.events'] || {};
    bus = buses[eventName];
    if (!bus) {
      bus = buses[eventName] = new Bacon.Bus;
      this[eventName] = function(event) {
        return bus.push(event);
      };
    }
    return bus;
  },
  plug: function(stream, stateKey) {
    var bacon, unsubscribe, unsubscribers;
    unsubscribe = void 0;
    bacon = this._bacon || (this._bacon = {});
    unsubscribers = bacon.unsubscribers = bacon.unsubscribers || [];
    if (stateKey != null) {
      unsubscribe = stream.onValue((function(_this) {
        return function(partialState) {
          return _this.setState(partialState);
        };
      })(this));
    } else {
      unsubscribe = stream.onValue((function(_this) {
        return function(value) {
          var partialState;
          partialState = {};
          partialState[stateKey] = value;
          return _this.setState(partialState);
        };
      })(this));
    }
    unsubscribers.push(unsubscribe);
    return unsubscribe;
  },
  componentDidUpdate: function() {
    var allPropsBus, allStateBus, bacon;
    bacon = this._bacon;
    if (bacon) {
      allPropsBus = bacon['buses.allProps'];
      allPropsBus && allPropsBus.push(this.props);
      allStateBus = bacon['buses.allState'];
      allStateBus && allStateBus.push(this.state);
    }
  },
  componentWillUnmount: function() {
    var allPropsBus, allStateBus, bacon, eventBuses, eventName, i, len, ref, unsubscribe;
    bacon = this._bacon;
    if (bacon) {
      allPropsBus = bacon['buses.allProps'];
      allPropsBus && allPropsBus.end();
      allStateBus = bacon['buses.allState'];
      allStateBus && allStateBus.end();
      eventBuses = bacon['buses.events'];
      if (eventBuses) {
        for (eventName in eventBuses) {
          eventBuses[eventName].end();
        }
      }
      ref = bacon.unsubscribers || [];
      for (i = 0, len = ref.length; i < len; i++) {
        unsubscribe = ref[i];
        unsubscribe();
      }
    }
  }
};

propsOrStateProperty = function(component, allPropsOrStateKey, groupKey, filterKey) {
  var allPropertyKey, bacon, bus, filteredPropertyKey, groupedPropertiesKey, property, wholePropsOrStateProperty;
  bacon = component._bacon || (component._bacon = {});
  allPropertyKey = 'properties.' + allPropsOrStateKey;
  groupedPropertiesKey = 'properties.' + groupKey;
  property = bacon[allPropertyKey];
  if (!property) {
    bus = bacon['buses.' + allPropsOrStateKey] = new Bacon.Bus;
    property = bacon[allPropertyKey] = bus.toProperty(component[groupKey]).skipDuplicates(this.isEqual);
  }
  if (filterKey == null) {
    wholePropsOrStateProperty = property;
    filteredPropertyKey = groupedPropertiesKey + '.' + filterKey;
    property = bacon[filteredPropertyKey];
    if (!property) {
      property = bacon[filteredPropertyKey] = wholePropsOrStateProperty.filter(function(x) {
        return x;
      }).map(function(propsOrState) {
        return propsOrState[filterKey];
      }).skipDuplicates(this.isEqual).toProperty();
    }
  }
  return property;
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (global){
var Aui, React, exports, ref;

ref = global || window, React = ref.React, Aui = ref.Aui;

exports = module.exports = {
  React: React,
  Aui: Aui,
  Bacon: require('./bacon.cjsx')
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./bacon.cjsx":1}],3:[function(require,module,exports){
var Aui, Bacon, Page, React, cypher, empowered, encryptor, i, index, len, letter, magic, ref, symbol, symbols;

ref = require('./deps.cjsx'), Aui = ref.Aui, Bacon = ref.Bacon, React = ref.React;

symbols = "♈☽♋♎♌♍♊♘☥♃♐☾♂♆☉♓☿♑☆♉♄♀♅♏☄♒".split('');

empowered = "🌠";

encryptor = {};

cypher = {};

for (index = i = 0, len = symbols.length; i < len; index = ++i) {
  symbol = symbols[index];
  encryptor[String.fromCharCode(index + 65)] = "" + empowered + symbol;
  letter = String.fromCharCode(index + 97);
  encryptor[letter] = symbol;
  cypher[symbol] = letter;
}

magic = {
  enscribe: window.enscribe = function(scryt) {
    var result;
    result = scryt.replace(/[A-z]/g, function(letter) {
      var rune;
      rune = encryptor[letter] || letter;
      return rune;
    });
    return result;
  },
  decypher: window.decypher = function(enscription) {
    var result;
    result = enscription.replace(new RegExp("(" + empowered + ")?(" + (symbols.join('|')) + ")", 'g'), function(_, big, rune) {
      letter = big ? ("" + (cypher[rune] || rune)).toUpperCase() : "" + (cypher[rune] || rune);
      return letter;
    });
    return result;
  }
};

Page = React.createClass({displayName: "Page",
  getInitialState: function() {
    return {
      icon: ''
    };
  },
  onClick: function(event) {
    return event.target.select();
  },
  onChange: function(event) {
    var state;
    state = {};
    state[event.target.name] = magic[event.target.name](event.target.value);
    return this.setState(state);
  },
  render: function() {
    return React.createElement(Aui, null, React.createElement("div", {
      "ui": true,
      "page": true,
      "grid": true
    }, React.createElement("div", {
      "ui": true,
      "inverted": true,
      "segment": true,
      "column": true
    }, React.createElement("form", {
      "ui": true,
      "form": true,
      "onSubmit": (function(event) {
        return event.preventDefault();
      })
    }, React.createElement("div", {
      "field": true
    }, React.createElement("textarea", {
      "scryt": true,
      "ui": true,
      "inverted": true,
      "input": true,
      "name": "enscribe",
      "onKeyUp": this.onChange,
      "onClick": this.onClick,
      "placeholder": "Pony Scryt",
      "setValue": this.state.decypher
    })), React.createElement("div", {
      "field": true
    }, React.createElement("textarea", {
      "ui": true,
      "inverted": true,
      "input": true,
      "name": "decypher",
      "onKeyUp": this.onChange,
      "onClick": this.onClick,
      "placeholder": "🌠♂☉☉♆☆♓♌♈♐",
      "setValue": this.state.enscribe
    }))))));
  }
});

React.render(React.createElement(Page, null), document.body);


},{"./deps.cjsx":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcZGV2XFxub2RlX21vZHVsZXNcXHByb2RcXG5vZGVfbW9kdWxlc1xcbW9vbnNwZWFrXFxzcmNcXGJhY29uLmNqc3giLCJDOlxcZGV2XFxub2RlX21vZHVsZXNcXHByb2RcXG5vZGVfbW9kdWxlc1xcbW9vbnNwZWFrXFxzcmNcXGRlcHMuY2pzeCIsIkM6XFxkZXZcXG5vZGVfbW9kdWxlc1xccHJvZFxcbm9kZV9tb2R1bGVzXFxtb29uc3BlYWtcXHNyY1xcbW9vbnNwZWFrLmNqc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEsSUFBQTs7QUFBQyxRQUFTLENBQUEsTUFBQSxJQUFVLE1BQVYsRUFBVDs7O0VBQ0QsTUFBTSxDQUFFLE9BQVIsR0FBa0I7OztBQUNsQixLQUFLLENBQUMsVUFBTixHQUNFO0VBQUEsT0FBQSxFQUFTLFNBQUMsQ0FBRCxFQUFJLENBQUo7QUFDUCxRQUFBO0lBQUEsSUFBYyxDQUFBLEtBQUssQ0FBbkI7QUFBQSxhQUFPLEtBQVA7O0lBQ0EsSUFBQSxDQUFBLENBQWlCLFdBQUEsSUFBTyxXQUF4QixDQUFBO0FBQUEsYUFBTyxNQUFQOztJQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsSUFBUCxDQUFZLENBQVo7SUFDUCxJQUFhLElBQUksQ0FBQyxNQUFMLEtBQWlCLENBQUMsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFaLENBQUQsQ0FBZSxDQUFDLE1BQTlDO0FBQUEsYUFBTyxNQUFQOztBQUNBLFNBQUEsc0NBQUE7O1VBQStCLENBQUUsQ0FBQSxHQUFBLENBQUYsS0FBWSxDQUFFLENBQUEsR0FBQTtBQUE3QyxlQUFPOztBQUFQO1dBQ0E7RUFOTyxDQUFUO0VBT0EsYUFBQSxFQUFlLFNBQUMsUUFBRDtXQUNiLG9CQUFBLENBQXFCLElBQXJCLEVBQXdCLFVBQXhCLEVBQW9DLE9BQXBDLEVBQTZDLFFBQTdDO0VBRGEsQ0FQZjtFQVNBLGFBQUEsRUFBZSxTQUFDLFNBQUQ7V0FDYixvQkFBQSxDQUFxQixJQUFyQixFQUF3QixVQUF4QixFQUFvQyxPQUFwQyxFQUE2QyxTQUE3QztFQURhLENBVGY7RUFXQSxXQUFBLEVBQWEsU0FBQyxTQUFEO0FBQ1gsUUFBQTtJQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsV0FBRCxJQUFDLENBQUEsU0FBVztJQUNwQixLQUFBLEdBQVEsS0FBTSxDQUFBLGNBQUEsQ0FBTixHQUF3QixLQUFNLENBQUEsY0FBQSxDQUFOLElBQXlCO0lBQ3pELEdBQUEsR0FBTSxLQUFNLENBQUEsU0FBQTtJQUNaLElBQUcsQ0FBQyxHQUFKO01BQ0UsR0FBQSxHQUFNLEtBQU0sQ0FBQSxTQUFBLENBQU4sR0FBbUIsSUFBSyxLQUFLLENBQUM7TUFDcEMsSUFBRSxDQUFBLFNBQUEsQ0FBRixHQUFlLFNBQUMsS0FBRDtlQUFXLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVDtNQUFYLEVBRmpCOztXQUdBO0VBUFcsQ0FYYjtFQW1CQSxJQUFBLEVBQU0sU0FBQyxNQUFELEVBQVMsUUFBVDtBQUNKLFFBQUE7SUFBQSxXQUFBLEdBQWM7SUFDZCxLQUFBLEdBQVEsSUFBQyxDQUFBLFdBQUQsSUFBQyxDQUFBLFNBQVc7SUFDcEIsYUFBQSxHQUFnQixLQUFLLENBQUMsYUFBTixHQUFzQixLQUFLLENBQUMsYUFBTixJQUF1QjtJQUM3RCxJQUFHLGdCQUFIO01BQ0UsV0FBQSxHQUFjLE1BQU0sQ0FBQyxPQUFQLENBQWUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFlBQUQ7aUJBQWtCLEtBQUMsQ0FBQSxRQUFELENBQVUsWUFBVjtRQUFsQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZixFQURoQjtLQUFBLE1BQUE7TUFHRSxXQUFBLEdBQWMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtBQUMzQixjQUFBO1VBQUEsWUFBQSxHQUFlO1VBQ2YsWUFBYSxDQUFBLFFBQUEsQ0FBYixHQUF5QjtpQkFDekIsS0FBQyxDQUFBLFFBQUQsQ0FBVSxZQUFWO1FBSDJCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmLEVBSGhCOztJQU9BLGFBQWEsQ0FBQyxJQUFkLENBQW1CLFdBQW5CO1dBQ0E7RUFaSSxDQW5CTjtFQWdDQSxrQkFBQSxFQUFvQixTQUFBO0FBQ2xCLFFBQUE7SUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBO0lBQ1QsSUFBRyxLQUFIO01BQ0UsV0FBQSxHQUFjLEtBQU0sQ0FBQSxnQkFBQTtNQUNwQixXQUFBLElBQWdCLFdBQVcsQ0FBQyxJQUFaLENBQWlCLElBQUMsQ0FBQSxLQUFsQjtNQUNoQixXQUFBLEdBQWMsS0FBTSxDQUFBLGdCQUFBO01BQ3BCLFdBQUEsSUFBZ0IsV0FBVyxDQUFDLElBQVosQ0FBaUIsSUFBQyxDQUFBLEtBQWxCLEVBSmxCOztFQUZrQixDQWhDcEI7RUF3Q0Esb0JBQUEsRUFBc0IsU0FBQTtBQUNwQixRQUFBO0lBQUEsS0FBQSxHQUFRLElBQUMsQ0FBQTtJQUNULElBQUcsS0FBSDtNQUNFLFdBQUEsR0FBYyxLQUFNLENBQUEsZ0JBQUE7TUFDcEIsV0FBQSxJQUFnQixXQUFXLENBQUMsR0FBWixDQUFBO01BQ2hCLFdBQUEsR0FBYyxLQUFNLENBQUEsZ0JBQUE7TUFDcEIsV0FBQSxJQUFnQixXQUFXLENBQUMsR0FBWixDQUFBO01BQ2hCLFVBQUEsR0FBYSxLQUFNLENBQUEsY0FBQTtNQUNuQixJQUFHLFVBQUg7QUFDRSxhQUFBLHVCQUFBO1VBQ0UsVUFBVyxDQUFBLFNBQUEsQ0FBVSxDQUFDLEdBQXRCLENBQUE7QUFERixTQURGOztBQUdBO0FBQUEsV0FBQSxxQ0FBQTs7UUFBQSxXQUFBLENBQUE7QUFBQSxPQVRGOztFQUZvQixDQXhDdEI7OztBQXNERixvQkFBQSxHQUF1QixTQUFDLFNBQUQsRUFBWSxrQkFBWixFQUFnQyxRQUFoQyxFQUEwQyxTQUExQztBQUNyQixNQUFBO0VBQUEsS0FBQSxHQUFRLFNBQVMsQ0FBQyxXQUFWLFNBQVMsQ0FBQyxTQUFXO0VBQzdCLGNBQUEsR0FBaUIsYUFBQSxHQUFnQjtFQUNqQyxvQkFBQSxHQUF1QixhQUFBLEdBQWdCO0VBQ3ZDLFFBQUEsR0FBVyxLQUFNLENBQUEsY0FBQTtFQUNqQixJQUFHLENBQUMsUUFBSjtJQUNFLEdBQUEsR0FBTSxLQUFNLENBQUEsUUFBQSxHQUFXLGtCQUFYLENBQU4sR0FBdUMsSUFBSSxLQUFLLENBQUM7SUFDdkQsUUFBQSxHQUFXLEtBQU0sQ0FBQSxjQUFBLENBQU4sR0FBd0IsR0FDakMsQ0FBQyxVQURnQyxDQUNyQixTQUFVLENBQUEsUUFBQSxDQURXLENBRWpDLENBQUMsY0FGZ0MsQ0FFakIsSUFBQyxDQUFBLE9BRmdCLEVBRnJDOztFQUtBLElBQU8saUJBQVA7SUFDRSx5QkFBQSxHQUE0QjtJQUM1QixtQkFBQSxHQUFzQixvQkFBQSxHQUF1QixHQUF2QixHQUE2QjtJQUNuRCxRQUFBLEdBQVcsS0FBTSxDQUFBLG1CQUFBO0lBQ2pCLElBQUcsQ0FBQyxRQUFKO01BQ0UsUUFBQSxHQUFXLEtBQU0sQ0FBQSxtQkFBQSxDQUFOLEdBQTZCLHlCQUN0QyxDQUFDLE1BRHFDLENBQzlCLFNBQUMsQ0FBRDtlQUFPO01BQVAsQ0FEOEIsQ0FFdEMsQ0FBQyxHQUZxQyxDQUVqQyxTQUFDLFlBQUQ7ZUFBa0IsWUFBYSxDQUFBLFNBQUE7TUFBL0IsQ0FGaUMsQ0FHdEMsQ0FBQyxjQUhxQyxDQUd0QixJQUFDLENBQUEsT0FIcUIsQ0FJdEMsQ0FBQyxVQUpxQyxDQUFBLEVBRDFDO0tBSkY7O1NBVUE7QUFwQnFCOzs7Ozs7O0FDdkR2QixJQUFBOztBQUFBLE1BQWUsTUFBQSxJQUFVLE1BQXpCLEVBQUMsWUFBQSxLQUFELEVBQVEsVUFBQTs7QUFDUixPQUFBLEdBQVUsTUFBTSxDQUFDLE9BQVAsR0FBaUI7RUFDekIsT0FBQSxLQUR5QjtFQUV6QixLQUFBLEdBRnlCO0VBR3pCLEtBQUEsRUFBTyxPQUFBLENBQVEsY0FBUixDQUhrQjs7Ozs7OztBQ0gzQixJQUFBOztBQUFBLE1BQXNCLE9BQUEsQ0FBUSxhQUFSLENBQXRCLEVBQUMsVUFBQSxHQUFELEVBQU0sWUFBQSxLQUFOLEVBQWEsWUFBQTs7QUFFYixPQUFBLEdBQVUsNEJBQTRCLENBQUMsS0FBN0IsQ0FBbUMsRUFBbkM7O0FBQ1YsU0FBQSxHQUFZOztBQUNaLFNBQUEsR0FBWTs7QUFDWixNQUFBLEdBQVM7O0FBQ1QsS0FBQSx5REFBQTs7RUFDRSxTQUFVLENBQUEsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsS0FBQSxHQUFRLEVBQTVCLENBQUEsQ0FBVixHQUE0QyxFQUFBLEdBQUcsU0FBSCxHQUFlO0VBQzNELE1BQUEsR0FBUyxNQUFNLENBQUMsWUFBUCxDQUFvQixLQUFBLEdBQVEsRUFBNUI7RUFDVCxTQUFVLENBQUEsTUFBQSxDQUFWLEdBQW9CO0VBQ3BCLE1BQU8sQ0FBQSxNQUFBLENBQVAsR0FBaUI7QUFKbkI7O0FBTUEsS0FBQSxHQUNFO0VBQUEsUUFBQSxFQUFVLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFNBQUMsS0FBRDtBQUUxQixRQUFBO0lBQUEsTUFBQSxHQUFTLEtBQUssQ0FBQyxPQUFOLENBQWMsUUFBZCxFQUF3QixTQUFDLE1BQUQ7QUFDL0IsVUFBQTtNQUFBLElBQUEsR0FBTyxTQUFVLENBQUEsTUFBQSxDQUFWLElBQXFCO2FBRTVCO0lBSCtCLENBQXhCO1dBTVQ7RUFSMEIsQ0FBNUI7RUFTQSxRQUFBLEVBQVUsTUFBTSxDQUFDLFFBQVAsR0FBa0IsU0FBQyxXQUFEO0FBRTFCLFFBQUE7SUFBQSxNQUFBLEdBQVMsV0FBVyxDQUFDLE9BQVosQ0FBeUIsSUFBQSxNQUFBLENBQU8sR0FBQSxHQUFJLFNBQUosR0FBYyxLQUFkLEdBQWtCLENBQUMsT0FBTyxDQUFDLElBQVIsQ0FBYSxHQUFiLENBQUQsQ0FBbEIsR0FBb0MsR0FBM0MsRUFBK0MsR0FBL0MsQ0FBekIsRUFBOEUsU0FBQyxDQUFELEVBQUksR0FBSixFQUFTLElBQVQ7TUFDckYsTUFBQSxHQUFZLEdBQUgsR0FDTCxDQUFBLEVBQUEsR0FBRSxDQUFDLE1BQU8sQ0FBQSxJQUFBLENBQVAsSUFBZ0IsSUFBakIsQ0FBRixDQUF5QixDQUFDLFdBQTFCLENBQUEsQ0FESyxHQUdMLEVBQUEsR0FBRSxDQUFDLE1BQU8sQ0FBQSxJQUFBLENBQVAsSUFBZ0IsSUFBakI7YUFFTjtJQU5xRixDQUE5RTtXQVFUO0VBVjBCLENBVDVCOzs7QUFzQkYsSUFBQSxHQUFPLEtBQUssQ0FBQyxXQUFOLENBQ0w7RUFBQSxlQUFBLEVBQWlCLFNBQUE7V0FBRztNQUFBLElBQUEsRUFBTSxFQUFOOztFQUFILENBQWpCO0VBQ0EsT0FBQSxFQUFTLFNBQUMsS0FBRDtXQUNQLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBYixDQUFBO0VBRE8sQ0FEVDtFQUdBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFDUixRQUFBO0lBQUEsS0FBQSxHQUFRO0lBQ1IsS0FBTSxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBYixDQUFOLEdBQTJCLEtBQU0sQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQWIsQ0FBTixDQUF5QixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQXRDO1dBQzNCLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVjtFQUhRLENBSFY7RUFPQSxNQUFBLEVBQVEsU0FBQTtXQUNOLEtBQUssQ0FBQyxhQUFOLENBQW9CLEdBQXBCLEVBQXlCLElBQXpCLEVBQ0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7TUFBQyxJQUFBLEVBQU0sSUFBUDtNQUFhLE1BQUEsRUFBUSxJQUFyQjtNQUEyQixNQUFBLEVBQVEsSUFBbkM7S0FBM0IsRUFDRSxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFwQixFQUEyQjtNQUFDLElBQUEsRUFBTSxJQUFQO01BQWEsVUFBQSxFQUFZLElBQXpCO01BQStCLFNBQUEsRUFBVyxJQUExQztNQUFnRCxRQUFBLEVBQVUsSUFBMUQ7S0FBM0IsRUFDRSxLQUFLLENBQUMsYUFBTixDQUFvQixNQUFwQixFQUE0QjtNQUFDLElBQUEsRUFBTSxJQUFQO01BQWEsTUFBQSxFQUFRLElBQXJCO01BQTJCLFVBQUEsRUFBWSxDQUFDLFNBQUMsS0FBRDtlQUFXLEtBQUssQ0FBQyxjQUFOLENBQUE7TUFBWCxDQUFELENBQXZDO0tBQTVCLEVBQ0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7TUFBQyxPQUFBLEVBQVMsSUFBVjtLQUEzQixFQUNFLEtBQUssQ0FBQyxhQUFOLENBQW9CLFVBQXBCLEVBQWdDO01BQUMsT0FBQSxFQUFTLElBQVY7TUFBZ0IsSUFBQSxFQUFNLElBQXRCO01BQTRCLFVBQUEsRUFBWSxJQUF4QztNQUE4QyxPQUFBLEVBQVMsSUFBdkQ7TUFBNkQsTUFBQSxFQUFRLFVBQXJFO01BQWlGLFNBQUEsRUFBWSxJQUFDLENBQUEsUUFBOUY7TUFBeUcsU0FBQSxFQUFZLElBQUMsQ0FBQSxPQUF0SDtNQUFnSSxhQUFBLEVBQWUsWUFBL0k7TUFBNkosVUFBQSxFQUFhLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBakw7S0FBaEMsQ0FERixDQURGLEVBSUUsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7TUFBQyxPQUFBLEVBQVMsSUFBVjtLQUEzQixFQUNFLEtBQUssQ0FBQyxhQUFOLENBQW9CLFVBQXBCLEVBQWdDO01BQUMsSUFBQSxFQUFNLElBQVA7TUFBYSxVQUFBLEVBQVksSUFBekI7TUFBK0IsT0FBQSxFQUFTLElBQXhDO01BQThDLE1BQUEsRUFBUSxVQUF0RDtNQUFrRSxTQUFBLEVBQVksSUFBQyxDQUFBLFFBQS9FO01BQTBGLFNBQUEsRUFBWSxJQUFDLENBQUEsT0FBdkc7TUFBaUgsYUFBQSxFQUFlLGFBQWhJO01BQStJLFVBQUEsRUFBYSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQW5LO0tBQWhDLENBREYsQ0FKRixDQURGLENBREYsQ0FERjtFQURNLENBUFI7Q0FESzs7QUF3QlAsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFLLENBQUMsYUFBTixDQUFvQixJQUFwQixFQUEwQixJQUExQixDQUFiLEVBQThDLFFBQVEsQ0FBQyxJQUF2RCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ7QmFjb259ID0gZ2xvYmFsIG9yIHdpbmRvd1xubW9kdWxlPy5leHBvcnRzID0gQmFjb25cbkJhY29uLkJhY29uTWl4aW4gPVxuICBpc0VxdWFsOiAoYSwgYikgLT5cbiAgICByZXR1cm4geWVzIGlmIGEgaXMgYlxuICAgIHJldHVybiBubyB1bmxlc3MgYT8gYW5kIGI/XG4gICAga2V5cyA9IE9iamVjdC5rZXlzIGFcbiAgICByZXR1cm4gbm8gaWYga2V5cy5sZW5ndGggaXNudCAoT2JqZWN0LmtleXMgYikubGVuZ3RoXG4gICAgcmV0dXJuIG5vIGZvciBrZXkgaW4ga2V5cyB3aGVuIGFba2V5XSBpc250IGJba2V5XVxuICAgIHllc1xuICBwcm9wc1Byb3BlcnR5OiAocHJvcE5hbWUpIC0+XG4gICAgcHJvcHNPclN0YXRlUHJvcGVydHkgQCwgJ2FsbFByb3BzJywgJ3Byb3BzJywgcHJvcE5hbWVcbiAgc3RhdGVQcm9wZXJ0eTogKHN0YXRlTmFtZSkgLT5cbiAgICBwcm9wc09yU3RhdGVQcm9wZXJ0eSBALCAnYWxsU3RhdGUnLCAnc3RhdGUnLCBzdGF0ZU5hbWVcbiAgZXZlbnRTdHJlYW06IChldmVudE5hbWUpIC0+XG4gICAgYmFjb24gPSBAX2JhY29uIG9yPSB7fVxuICAgIGJ1c2VzID0gYmFjb25bJ2J1c2VzLmV2ZW50cyddID0gYmFjb25bJ2J1c2VzLmV2ZW50cyddIG9yIHt9XG4gICAgYnVzID0gYnVzZXNbZXZlbnROYW1lXVxuICAgIGlmICFidXNcbiAgICAgIGJ1cyA9IGJ1c2VzW2V2ZW50TmFtZV0gPSBuZXcgKEJhY29uLkJ1cylcbiAgICAgIEBbZXZlbnROYW1lXSA9IChldmVudCkgLT4gYnVzLnB1c2ggZXZlbnRcbiAgICBidXNcbiAgcGx1ZzogKHN0cmVhbSwgc3RhdGVLZXkpIC0+XG4gICAgdW5zdWJzY3JpYmUgPSB1bmRlZmluZWRcbiAgICBiYWNvbiA9IEBfYmFjb24gb3I9IHt9XG4gICAgdW5zdWJzY3JpYmVycyA9IGJhY29uLnVuc3Vic2NyaWJlcnMgPSBiYWNvbi51bnN1YnNjcmliZXJzIG9yIFtdXG4gICAgaWYgc3RhdGVLZXk/XG4gICAgICB1bnN1YnNjcmliZSA9IHN0cmVhbS5vblZhbHVlIChwYXJ0aWFsU3RhdGUpID0+IEBzZXRTdGF0ZSBwYXJ0aWFsU3RhdGVcbiAgICBlbHNlXG4gICAgICB1bnN1YnNjcmliZSA9IHN0cmVhbS5vblZhbHVlICh2YWx1ZSkgPT5cbiAgICAgICAgcGFydGlhbFN0YXRlID0ge31cbiAgICAgICAgcGFydGlhbFN0YXRlW3N0YXRlS2V5XSA9IHZhbHVlXG4gICAgICAgIEBzZXRTdGF0ZSBwYXJ0aWFsU3RhdGVcbiAgICB1bnN1YnNjcmliZXJzLnB1c2ggdW5zdWJzY3JpYmVcbiAgICB1bnN1YnNjcmliZVxuICBjb21wb25lbnREaWRVcGRhdGU6IC0+XG4gICAgYmFjb24gPSBAX2JhY29uXG4gICAgaWYgYmFjb25cbiAgICAgIGFsbFByb3BzQnVzID0gYmFjb25bJ2J1c2VzLmFsbFByb3BzJ11cbiAgICAgIGFsbFByb3BzQnVzIGFuZCBhbGxQcm9wc0J1cy5wdXNoIEBwcm9wc1xuICAgICAgYWxsU3RhdGVCdXMgPSBiYWNvblsnYnVzZXMuYWxsU3RhdGUnXVxuICAgICAgYWxsU3RhdGVCdXMgYW5kIGFsbFN0YXRlQnVzLnB1c2ggQHN0YXRlXG4gICAgcmV0dXJuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiAtPlxuICAgIGJhY29uID0gQF9iYWNvblxuICAgIGlmIGJhY29uXG4gICAgICBhbGxQcm9wc0J1cyA9IGJhY29uWydidXNlcy5hbGxQcm9wcyddXG4gICAgICBhbGxQcm9wc0J1cyBhbmQgYWxsUHJvcHNCdXMuZW5kKClcbiAgICAgIGFsbFN0YXRlQnVzID0gYmFjb25bJ2J1c2VzLmFsbFN0YXRlJ11cbiAgICAgIGFsbFN0YXRlQnVzIGFuZCBhbGxTdGF0ZUJ1cy5lbmQoKVxuICAgICAgZXZlbnRCdXNlcyA9IGJhY29uWydidXNlcy5ldmVudHMnXVxuICAgICAgaWYgZXZlbnRCdXNlc1xuICAgICAgICBmb3IgZXZlbnROYW1lIG9mIGV2ZW50QnVzZXNcbiAgICAgICAgICBldmVudEJ1c2VzW2V2ZW50TmFtZV0uZW5kKClcbiAgICAgIHVuc3Vic2NyaWJlKCkgZm9yIHVuc3Vic2NyaWJlIGluIGJhY29uLnVuc3Vic2NyaWJlcnMgb3IgW11cbiAgICAgIHJldHVyblxuXG5wcm9wc09yU3RhdGVQcm9wZXJ0eSA9IChjb21wb25lbnQsIGFsbFByb3BzT3JTdGF0ZUtleSwgZ3JvdXBLZXksIGZpbHRlcktleSkgLT5cbiAgYmFjb24gPSBjb21wb25lbnQuX2JhY29uIG9yPSB7fVxuICBhbGxQcm9wZXJ0eUtleSA9ICdwcm9wZXJ0aWVzLicgKyBhbGxQcm9wc09yU3RhdGVLZXlcbiAgZ3JvdXBlZFByb3BlcnRpZXNLZXkgPSAncHJvcGVydGllcy4nICsgZ3JvdXBLZXlcbiAgcHJvcGVydHkgPSBiYWNvblthbGxQcm9wZXJ0eUtleV1cbiAgaWYgIXByb3BlcnR5XG4gICAgYnVzID0gYmFjb25bJ2J1c2VzLicgKyBhbGxQcm9wc09yU3RhdGVLZXldID0gbmV3IEJhY29uLkJ1c1xuICAgIHByb3BlcnR5ID0gYmFjb25bYWxsUHJvcGVydHlLZXldID0gYnVzXG4gICAgICAudG9Qcm9wZXJ0eSBjb21wb25lbnRbZ3JvdXBLZXldXG4gICAgICAuc2tpcER1cGxpY2F0ZXMgQGlzRXF1YWxcbiAgdW5sZXNzIGZpbHRlcktleT9cbiAgICB3aG9sZVByb3BzT3JTdGF0ZVByb3BlcnR5ID0gcHJvcGVydHlcbiAgICBmaWx0ZXJlZFByb3BlcnR5S2V5ID0gZ3JvdXBlZFByb3BlcnRpZXNLZXkgKyAnLicgKyBmaWx0ZXJLZXlcbiAgICBwcm9wZXJ0eSA9IGJhY29uW2ZpbHRlcmVkUHJvcGVydHlLZXldXG4gICAgaWYgIXByb3BlcnR5XG4gICAgICBwcm9wZXJ0eSA9IGJhY29uW2ZpbHRlcmVkUHJvcGVydHlLZXldID0gd2hvbGVQcm9wc09yU3RhdGVQcm9wZXJ0eVxuICAgICAgICAuZmlsdGVyICh4KSAtPiB4XG4gICAgICAgIC5tYXAgKHByb3BzT3JTdGF0ZSkgLT4gcHJvcHNPclN0YXRlW2ZpbHRlcktleV1cbiAgICAgICAgLnNraXBEdXBsaWNhdGVzIEBpc0VxdWFsXG4gICAgICAgIC50b1Byb3BlcnR5KClcbiAgcHJvcGVydHlcbiIsIlxuIyBucG0gaW5zdGFsbCBhdWlAbGF0ZXN0IHJlYWN0LWJhY29uQGxhdGVzdFxue1JlYWN0LCBBdWl9ID0gZ2xvYmFsIG9yIHdpbmRvd1xuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBSZWFjdFxuICBBdWlcbiAgQmFjb246IHJlcXVpcmUgJy4vYmFjb24uY2pzeCdcbn1cbiIsIntBdWksIEJhY29uLCBSZWFjdH0gPSByZXF1aXJlICcuL2RlcHMuY2pzeCdcblxuc3ltYm9scyA9IFwi4pmI4pi94pmL4pmO4pmM4pmN4pmK4pmY4pil4pmD4pmQ4pi+4pmC4pmG4piJ4pmT4pi/4pmR4piG4pmJ4pmE4pmA4pmF4pmP4piE4pmSXCIuc3BsaXQgJydcbmVtcG93ZXJlZCA9IFwi8J+MoFwiXG5lbmNyeXB0b3IgPSB7fVxuY3lwaGVyID0ge31cbmZvciBzeW1ib2wsIGluZGV4IGluIHN5bWJvbHNcbiAgZW5jcnlwdG9yW1N0cmluZy5mcm9tQ2hhckNvZGUgaW5kZXggKyA2NV0gPSBcIiN7ZW1wb3dlcmVkfSN7c3ltYm9sfVwiXG4gIGxldHRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUgaW5kZXggKyA5N1xuICBlbmNyeXB0b3JbbGV0dGVyXSA9IHN5bWJvbFxuICBjeXBoZXJbc3ltYm9sXSA9IGxldHRlclxuI2xvZ3MgPSBbXVxubWFnaWMgPVxuICBlbnNjcmliZTogd2luZG93LmVuc2NyaWJlID0gKHNjcnl0KSAtPlxuICAgICNsb2dzID0gW11cbiAgICByZXN1bHQgPSBzY3J5dC5yZXBsYWNlIC9bQS16XS9nLCAobGV0dGVyKSAtPlxuICAgICAgcnVuZSA9IGVuY3J5cHRvcltsZXR0ZXJdIG9yIGxldHRlclxuICAgICAgI2xvZ3MucHVzaCBcIiAje2xldHRlcn0gLT4gI3tydW5lfSBcIlxuICAgICAgcnVuZVxuICAgICNjb25zb2xlLmxvZyBsb2dzLmpvaW4gJydcbiAgICAjY29uc29sZS5sb2cgXCJFbnNjcmlwdGlvbjogI3tyZXN1bHR9XCJcbiAgICByZXN1bHRcbiAgZGVjeXBoZXI6IHdpbmRvdy5kZWN5cGhlciA9IChlbnNjcmlwdGlvbikgLT5cbiAgICAjbG9ncyA9IFtdXG4gICAgcmVzdWx0ID0gZW5zY3JpcHRpb24ucmVwbGFjZSAobmV3IFJlZ0V4cCBcIigje2VtcG93ZXJlZH0pPygje3N5bWJvbHMuam9pbiAnfCd9KVwiLCAnZycpLCAoXywgYmlnLCBydW5lKSAtPlxuICAgICAgbGV0dGVyID0gaWYgYmlnXG4gICAgICAgICAgXCIje2N5cGhlcltydW5lXSBvciBydW5lfVwiLnRvVXBwZXJDYXNlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFwiI3tjeXBoZXJbcnVuZV0gb3IgcnVuZX1cIlxuICAgICAgI2xvZ3MucHVzaCBcIiAje3J1bmV9IC0+ICN7bGV0dGVyfSBcIlxuICAgICAgbGV0dGVyXG4gICAgI2NvbnNvbGUubG9nIGxvZ3Muam9pbiAnJ1xuICAgIHJlc3VsdFxuXG5cblBhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICBnZXRJbml0aWFsU3RhdGU6IC0+IGljb246ICcnXG4gIG9uQ2xpY2s6IChldmVudCkgLT5cbiAgICBldmVudC50YXJnZXQuc2VsZWN0KClcbiAgb25DaGFuZ2U6IChldmVudCkgLT5cbiAgICBzdGF0ZSA9IHt9XG4gICAgc3RhdGVbZXZlbnQudGFyZ2V0Lm5hbWVdID0gbWFnaWNbZXZlbnQudGFyZ2V0Lm5hbWVdIGV2ZW50LnRhcmdldC52YWx1ZVxuICAgIEBzZXRTdGF0ZSBzdGF0ZVxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChBdWksIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcInVpXCI6IHRydWUsIFwicGFnZVwiOiB0cnVlLCBcImdyaWRcIjogdHJ1ZX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1widWlcIjogdHJ1ZSwgXCJpbnZlcnRlZFwiOiB0cnVlLCBcInNlZ21lbnRcIjogdHJ1ZSwgXCJjb2x1bW5cIjogdHJ1ZX0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZvcm1cIiwge1widWlcIjogdHJ1ZSwgXCJmb3JtXCI6IHRydWUsIFwib25TdWJtaXRcIjogKChldmVudCkgLT4gZXZlbnQucHJldmVudERlZmF1bHQoKSl9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJmaWVsZFwiOiB0cnVlfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIsIHtcInNjcnl0XCI6IHRydWUsIFwidWlcIjogdHJ1ZSwgXCJpbnZlcnRlZFwiOiB0cnVlLCBcImlucHV0XCI6IHRydWUsIFwibmFtZVwiOiBcImVuc2NyaWJlXCIsIFwib25LZXlVcFwiOiAoQG9uQ2hhbmdlKSwgXCJvbkNsaWNrXCI6IChAb25DbGljayksIFwicGxhY2Vob2xkZXJcIjogXCJQb255IFNjcnl0XCIsIFwic2V0VmFsdWVcIjogKEBzdGF0ZS5kZWN5cGhlcil9KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiZmllbGRcIjogdHJ1ZX0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiLCB7XCJ1aVwiOiB0cnVlLCBcImludmVydGVkXCI6IHRydWUsIFwiaW5wdXRcIjogdHJ1ZSwgXCJuYW1lXCI6IFwiZGVjeXBoZXJcIiwgXCJvbktleVVwXCI6IChAb25DaGFuZ2UpLCBcIm9uQ2xpY2tcIjogKEBvbkNsaWNrKSwgXCJwbGFjZWhvbGRlclwiOiBcIvCfjKDimYLimInimInimYbimIbimZPimYzimYjimZBcIiwgXCJzZXRWYWx1ZVwiOiAoQHN0YXRlLmVuc2NyaWJlKX0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5SZWFjdC5yZW5kZXIgUmVhY3QuY3JlYXRlRWxlbWVudChQYWdlLCBudWxsKSwgZG9jdW1lbnQuYm9keVxuIl19
