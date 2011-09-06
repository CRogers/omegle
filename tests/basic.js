(function() {
  var Omegle, omg;
  Omegle = require('../lib/omegle').Omegle;
  omg = new Omegle();
  omg.connect(function(err) {
    return console.log("Error " + err);
  });
}).call(this);
