var Omegle, omg, startconv;
Omegle = require('../lib/omegle').Omegle;
omg = new Omegle();
omg.on('start', function(data) {
  console.log('lolhi ' + data);
  return setTimeout(startconv, 1500);
});
omg.start(function(err) {
  if (err) {
    return console.log("Error " + err);
  }
});
startconv = function() {
  return omg.send('hi', function(err) {
    return console.log("Error " + err);
  });
};