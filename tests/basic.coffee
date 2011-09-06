Omegle = require('../lib/omegle').Omegle

omg = new Omegle()

omg.on 'start', (data) -> console.log 'lolhi ' + data

omg.start (err) -> console.log "Error #{err}"
