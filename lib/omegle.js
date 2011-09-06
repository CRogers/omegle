var EventEmitter, Omegle, getAllData, http, request, sys;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
  __extends(Omegle, EventEmitter);
  function Omegle() {
    Omegle.__super__.constructor.apply(this, arguments);
  }
  Omegle.prototype.start = function(err) {
    return request('GET', '/start', __bind(function(res) {
      if (res.statusCode !== 200) {
        if (err) {
          err(res.statusCode);
        }
        return;
      }
      return getAllData(res, __bind(function(data) {
        console.log("Got new id: " + data);
        this.id = data;
        return this.emit('start', data);
      }, this));
    }, this));
  };
  Omegle.prototype.say = function(msg, err) {
    console.log('saying ' + msg);
    return request('POST', "/send?id=" + id + "&msg=" + msg, function(res) {
      return console.log(res.statusCode);
    });
  };
  Omegle.prototype.disconnect = function() {
    return this.emit('disconnect');
  };
  return Omegle;
})();
exports.Omegle = Omegle;