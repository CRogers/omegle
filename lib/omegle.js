(function() {
  var EventEmitter, Omegle;
  EventEmitter = require('events').EventEmitter;
  Omegle = (function() {
    function Omegle() {
      EventEmitter.call(this);
    }
    Omegle.prototype.connect = function() {
      return this.emit('connected');
    };
    Omegle.prototype.say = function(text) {};
    Omegle.prototype.disconnect = function() {
      return this.emit('disconnected');
    };
    return Omegle;
  })();
  Omegle.prototype = Object.create(EventEmitter.prototype.prototype);
}).call(this);
