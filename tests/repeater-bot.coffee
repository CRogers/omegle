Omegle = require('../lib/omegle').Omegle

om = new Omegle()

om.on 'recaptchaRequired', (key) ->
	console.log "Recaptcha Required: #{key}"
	
om.on 'gotMessage', (msg) ->
	console.log "Got message: #{msg}"
	
	repeat = ->
		sent = "You said: #{msg}" 
		om.send sent, (err) ->
			console.log if !err then "Message sent: #{sent}" else "Error: #{err}"
	
	om.startTyping -> console.log "We started typing"
	setTimeout repeat, 800

om.on 'strangerDisconnected', ->
	console.log "Stranger disconnected"
	start()

om.on 'typing', -> console.log 'Stranger started typing'
om.on 'stoppedTyping', -> console.log 'Stranger stopped typing'

start = ->
	om.start -> 
		console.log "connected with id #{om.id}"
		

start()
