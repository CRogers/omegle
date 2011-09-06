(function() {
  var EventEmitter, Omegle, getAllData, http, request, sys;
  EventEmitter = require('events').EventEmitter;
  sys = require('sys');
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
    }
    sys.inherits(Omegle, EventEmitter);
    Omegle.prototype.start = function(err) {
      return request('GET', '/start', function(res) {
        if (res.statusCode !== 200) {
          if (err) {
            err(res.statusCode);
          }
          return;
        }
        return getAllData(res, function(data) {
          console.log("Got new id: " + data);
          this.id = data;
          return Omegle.prototype.emit('connected', data);
        });
      });
    };
    Omegle.prototype.say = function(msg, err) {
      console.log('saying ' + msg);
      return request('POST', "/send?id=" + id + "&msg=" + msg, function(res) {
        return console.log(res.statusCode);
      });
    };
    Omegle.prototype.disconnect = function() {
      return Omegle.prototype.emit('disconnect');
    };
    return Omegle;
  })();
  exports.Omegle = Omegle;
}).call(this);
