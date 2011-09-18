var Omegle, om, start;
Omegle = require('../lib/omegle').Omegle;
om = new Omegle();
om.on('recaptchaRequired', function(key) {
  return console.log("Recaptcha Required: " + key);
});
om.on('gotMessage', function(msg) {
  var repeat;
  console.log("Got message: " + msg);
  repeat = function() {
    var sent;
    sent = "You said: " + msg;
    return om.send(sent, function(err) {
      return console.log(!err ? "Message sent: " + sent : "Error: " + err);
    });
  };
  om.startTyping(function() {
    return console.log("We started typing");
  });
  return setTimeout(repeat, 800);
});
om.on('strangerDisconnected', function() {
  console.log("Stranger disconnected");
  return start();
});
om.on('typing', function() {
  return console.log('Stranger started typing');
});
om.on('stoppedTyping', function() {
  return console.log('Stranger stopped typing');
});
start = function() {
  return om.start(function() {
    return console.log("connected with id " + om.id);
  });
};
start();