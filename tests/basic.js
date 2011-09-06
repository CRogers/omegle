var Omegle, omg;
Omegle = require('../lib/omegle').Omegle;
omg = new Omegle();
omg.on('start', function(data) {
  return console.log('lolhi ' + data);
});
omg.start(function(err) {
  return console.log("Error " + err);
});