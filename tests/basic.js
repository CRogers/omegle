(function() {
  var Omegle, omg;
  Omegle = require('../lib/omegle').Omegle;
  omg = new Omegle();
  omg.start(function(err) {
    return console.log("Error " + err);
  });
  console.log(Omegle.prototype);
  omg.on('connect', function(data) {
    return console.log('lolhi ' + data);
  });
}).call(this);
