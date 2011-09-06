Omegle = require('../lib/omegle').Omegle

omg = new Omegle()
omg.start (err) -> console.log "Error #{err}"

console.log Omegle::

omg.on 'connect', (data) -> console.log 'lolhi ' + data
