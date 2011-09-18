Omegle = require('../lib/omegle').Omegle

omg = new Omegle()

omg.on 'newid', (data) -> 
	console.log 'lolhi ' + data
	setTimeout startconv, 1500

omg.on 'connected', -> console.log 'yay'

omg.on 'recaptchaRequired', (code) ->
	# PLACE HUMANS HERE
	console.log "Looks like we have to solve this sadly: #{code}"
	

omg.start (err) ->
	console.log "Error start #{err}" if err

startconv = ->
	omg.send 'hi', (err) -> 
		console.log "Error send #{err}" if err
		
		omg.disconnect (err) ->
			console.log "Error disconnect #{err}" if err
