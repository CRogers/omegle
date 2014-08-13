Omegle for node
===

Quickstart
---

Take a look in the `tests/` folder for more bulked out (and useful) examples.

Installion:

    npm install omegle

Script:

```javascript
Omegle = require('omegle').Omegle;

// This creates the instance.
// By default it searchs for English speaking strangers,
// see "Further Asides" for changing the language
var om = new Omegle();

// This starts a new conversation
om.start(function(err){
  if(err)
    console.log(err);
});

// Omegle extends the standard EventEmitter class so just use the  on  function to subscribe to them
// See below for full list
om.on('disconnected', function(){
  om.start();
});

// Show you are typing/not typing (optional callback  function(err){}  when request completes)
om.startTyping([callback]);
om.stopTyping([callback]);

// Disconnect from current chat (callback as above)
om.disconnect([callback]);
```

Events list
---

These events are emitted, some with arguments:

    waiting
    connected
    gotMessage
    strangerDisconnected
    typing
    stoppedTyping
    recaptchaRequired
    recaptchaRejected
    statusInfo
    spyMessage
    spyTyping
    spyStoppedTyping
    spyDisconnected
    question
    suggestSpyee
    antinudeBanned
    error

Untrue to its name, `antinudeBanned` does not necessarily mean you where banned for nudity. You will also get this response if your IP is banned because you used omegle too advertise or if you made connections to rapidly.

Captcha
---

Sadly, omegle has captchas. The `recaptchaRequired` event can be used to solve these by using a human (no, `npm install human` does not work here) or possibly making many new connections until a captcha is not required. This library was never intended to be used for say spamming or making automated bots, but more so that humans can interface with omegle without being on the site. So the odd captcha should not be too much of a problem provided you present the catpcha to the user and get them to input the result.

Further Asides
---

You can change the language you want to speak (by default English), user agent string, host to connect to and whetever you are mobile or not by using the constructor or by accessing the object:

```javascript
var om = new Omegle('user agent string', 'host', 'two-letter language code', 'mobile true/false');

om.userAgent = 'blah';
om.host = 'foo.omegle.com';
om.language = 'fr';
om.mobile = true;
```
