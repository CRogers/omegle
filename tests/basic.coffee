Omegle = require('../lib/omegle').Omegle

omg = new Omegle()
omg.connect (err) -> console.log "Error #{err}"
