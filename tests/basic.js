var Omegle, omg, startconv;
Omegle = require('../lib/omegle').Omegle;
omg = new Omegle();
omg.on('newid', function(data) {
  console.log('lolhi ' + data);
  return setTimeout(startconv, 1500);
});
omg.on('connected', function() {
  return console.log('yay');
});
omg.on('recaptchaRequired', function(code) {
  return console.log("Looks like we have to solve this sadly: " + code);
});
omg.start(function(err) {
  if (err) {
    return console.log("Error start " + err);
  }
});
startconv = function() {
  return omg.send('hi', function(err) {
    if (err) {
      console.log("Error send " + err);
    }
    return omg.disconnect(function(err) {
      if (err) {
        return console.log("Error disconnect " + err);
      }
    });
  });
};