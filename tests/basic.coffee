Omegle = require('../lib/omegle').Omegle

omg = new Omegle()

omg.on 'start', (data) -> 
	console.log 'lolhi ' + data
	setTimeout startconv, 1500

omg.start (err) ->
	if err
		console.log "Error #{err}"

startconv = ->
	omg.send 'hi', (err) -> 
		if err
			console.log "Error #{err}"
