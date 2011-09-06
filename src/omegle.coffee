EventEmitter = require('events').EventEmitter
http = require('http')

request = (method, path, callback) ->
	options = 
		method:	method
		host:	'www.omegle.com'
		port:	80
		path:	path
		
	req = http.request options, callback
	req.end()


getAllData = (res, callback) ->
	buffer = []
	res.on 'data', (chunk) -> buffer.push chunk
	res.on 'end', -> callback buffer.join ''


class Omegle
	constructor: ->
		EventEmitter.call this
		Omegle:: = Object.create EventEmitter::

	connect: (err) ->
		request 'GET', '/start', (res) ->
			if res.statusCode isnt 200
				err res.statusCode
				return
			
			getAllData res, (data) ->
				console.log data
				@emit 'connected'
		
	say: (text) ->
		
	disconnect: ->
		@emit('disconnected')

exports.Omegle = Omegle
