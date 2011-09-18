var EventEmitter, Omegle, fs, http, package, sys, version;
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
fs = require('fs');
version = 'Unknown';
package = fs.readFileSync('../package.json', 'utf8');
if (package) {
  version = JSON.parse(package).version;
}
Omegle = (function() {
  var getAllData;
  __extends(Omegle, EventEmitter);
  function Omegle(userAgent, host) {
    this.userAgent = userAgent || ("omegle node.js npm package/" + version);
    this.host = host || 'bajor.omegle.com';
  }
  Omegle.prototype.request = function(method, path, data, callback) {
    var options, req, _ref;
    options = {
      method: method,
      host: this.host,
      port: 80,
      path: path,
      headers: {
        'User-Agent': this.userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': (_ref = data != null ? data.length : void 0) != null ? _ref : 0
      }
    };
    console.log('Sending request:');
    console.log(options);
    req = http.request(options, callback);
    if (data) {
      req.write(data);
    }
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
  Omegle.prototype.start = function(err) {
    return this.request('GET', '/start', void 0, __bind(function(res) {
      if (res.statusCode !== 200) {
        if (err) {
          err(res.statusCode);
        }
        return;
      }
      return getAllData(res, __bind(function(data) {
        this.id = data.slice(1, data.length - 1);
        console.log("Got new id: " + this.id);
        return this.emit('start', this.id);
      }, this));
    }, this));
  };
  Omegle.prototype.send = function(msg, err) {
    console.log('saying ' + msg);
    return this.request('POST', "/send", "msg=" + msg + "&id=" + this.id, function(res) {
      getAllData(res, function(data) {
        return console.log(data);
      });
      if (res.statusCode !== 200) {
        return err(res.statusCode);
      } else {
        return err();
      }
    });
  };
  Omegle.prototype.disconnect = function() {
    return this.emit('disconnect');
  };
  return Omegle;
})();
exports.Omegle = Omegle;