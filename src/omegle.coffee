EventEmitter = require('events').EventEmitter

class Omegle
	constructor: ->
		# call the super constructor
		EventEmitter.call this

	connect: ->		
		@emit('connected')
		
	say: (text) ->
		
	disconnect: ->
		@emit('disconnected')

# get on and emit classes
Omegle:: = Object.create EventEmitter.prototype::
