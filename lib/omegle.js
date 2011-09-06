(function() {
  var EventEmitter, Omegle, getAllData, http, request;
  EventEmitter = require('events').EventEmitter;
  http = require('http');
  request = function(method, path, callback) {
    var options, req;
    options = {
      method: method,
      host: 'www.omegle.com',
      port: 80,
      path: path
    };
    req = http.request(options, callback);
    return req.end();
  };
  getAllData = function(res, callback) {
    var buffer;
    buffer = [];
    res.on('data', function(chunk) {
      return buffer.push(chunk);
    });
    return res.on('end', function() {
      return callback(buffer.join(''));
    });
  };
  Omegle = (function() {
    function Omegle() {
      EventEmitter.call(this);
      Omegle.prototype = Object.create(EventEmitter.prototype);
    }
    Omegle.prototype.connect = function(err) {
      return request('GET', '/start', function(res) {
        if (res.statusCode !== 200) {
          err(res.statusCode);
          return;
        }
        return getAllData(res, function(data) {
          console.log(data);
          return this.emit('connected');
        });
      });
    };
    Omegle.prototype.say = function(text) {};
    Omegle.prototype.disconnect = function() {
      return this.emit('disconnected');
    };
    return Omegle;
  })();
  exports.Omegle = Omegle;
}).call(this);
