var EventEmitter, Omegle, fs, http, package, version;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
EventEmitter = require('events').EventEmitter;
http = require('http');
fs = require('fs');
version = 'Unknown';
package = fs.readFileSync("" + __dirname + "/../package.json", 'utf8');
if (package) {
  version = JSON.parse(package).version;
}
Omegle = (function() {
  var callbackErr, formFormat, getAllData;
  __extends(Omegle, EventEmitter);
  function Omegle(userAgent, host) {
    this.userAgent = userAgent || ("omegle node.js npm package/" + version);
    this.host = host || 'bajor.omegle.com';
    this.on('strangerDisconnected', function() {
      return this.id = void 0;
    });
  }
  Omegle.prototype.requestGet = function(path, callback) {
    return this.requestFull('GET', path, void 0, void 0, callback);
  };
  Omegle.prototype.requestPost = function(path, data, callback) {
    return this.requestFull('POST', path, data, void 0, callback);
  };
  Omegle.prototype.requestKA = function(path, data, callback) {
    return this.requestFull('POST', path, data, true, callback);
  };
  Omegle.prototype.requestFull = function(method, path, data, keepAlive, callback) {
    var options, req;
    if (data) {
      data = formFormat(data);
    }
    options = {
      method: method,
      host: this.host,
      port: 80,
      path: path,
      headers: {
        'User-Agent': this.userAgent
      }
    };
    if (data) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.headers['Content-Length'] = data.length;
    }
    if (keepAlive) {
      options.headers['Connection'] = 'Keep-Alive';
    }
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
  callbackErr = function(callback, res) {
    return typeof callback === "function" ? callback((res.statusCode !== 200 ? res.statusCode : void 0)) : void 0;
  };
  formFormat = function(data) {
    var k, v;
    return ((function() {
      var _results;
      _results = [];
      for (k in data) {
        v = data[k];
        _results.push("" + k + "=" + v);
      }
      return _results;
    })()).join('&');
  };
  Omegle.prototype.start = function(callback) {
    return this.requestGet('/start', __bind(function(res) {
      if (res.statusCode !== 200) {
        if (typeof callback === "function") {
          callback(res.statusCode);
        }
        return;
      }
      return getAllData(res, __bind(function(data) {
        this.id = data.slice(1, data.length - 1);
        callback();
        this.emit('newid', this.id);
        return this.eventsLoop();
      }, this));
    }, this));
  };
  Omegle.prototype.send = function(msg, callback) {
    return this.requestPost('/send', {
      msg: msg,
      id: this.id
    }, function(res) {
      return callbackErr(callback, res);
    });
  };
  Omegle.prototype.postEvent = function(event, callback) {
    return this.requestPost("/" + event, {
      id: this.id
    }, function(res) {
      return callbackErr(callback, res);
    });
  };
  Omegle.prototype.startTyping = function(callback) {
    return this.postEvent('typing', callback);
  };
  Omegle.prototype.stopTyping = function(callback) {
    return this.postEvent('stopTyping', callback);
  };
  Omegle.prototype.disconnect = function(callback) {
    this.postEvent('disconnect', callback);
    return this.id = void 0;
  };
  Omegle.prototype.eventsLoop = function() {
    return this.requestKA('/events', {
      id: this.id
    }, __bind(function(res) {
      if (res.statusCode === 200) {
        return getAllData(res, __bind(function(eventData) {
          return this.eventReceived(eventData);
        }, this));
      }
    }, this));
  };
  Omegle.prototype.eventReceived = function(data) {
    var event, _i, _len;
    data = JSON.parse(data);
    if (data != null) {
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        event = data[_i];
        this.emit.apply(this, event);
      }
    }
    if (this.id) {
      return this.eventsLoop();
    }
  };
  return Omegle;
})();
exports.Omegle = Omegle;