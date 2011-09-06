EventEmitter = require('events').EventEmitter
sys = require('sys')
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
		EventEmitter.call(this)
		
	sys.inherits(Omegle, EventEmitter)
		
	start: (err) ->
		request 'GET', '/start', (res) ->
			if res.statusCode isnt 200
				if err
					err res.statusCode
				return
			
			getAllData res, (data) ->
				console.log "Got new id: " + data
				@id = data
				Omegle::emit 'connected', data
		
	say: (msg, err) ->
		console.log 'saying ' + msg
		request 'POST', "/send?id=#{id}&msg=#{msg}", (res) ->
			 console.log res.statusCode
		
	disconnect: ->
		Omegle::emit 'disconnect'

exports.Omegle = Omegle
