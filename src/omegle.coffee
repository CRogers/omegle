EventEmitter = require('events').EventEmitter
http = require('http')
fs = require('fs')

# Get version from package file
version = 'Unknown'
package = fs.readFileSync "#{__dirname}/../package.json", 'utf8'
if package
	version = JSON.parse(package).version

class Omegle extends EventEmitter

	constructor: (userAgent, host) ->
		@userAgent = userAgent || "omegle node.js npm package/#{version}"
		@host = host || 'bajor.omegle.com'
		
		@on 'strangerDisconnected', -> @id = undefined
	
	requestGet: (path, callback) ->
		@requestFull 'GET', path, undefined, undefined, callback
	
	requestPost: (path, data, callback) ->
		@requestFull 'POST', path, data, undefined, callback
	
	requestKA: (path, data, callback) ->
		@requestFull 'POST', path, data, true, callback
	
	requestFull: (method, path, data, keepAlive, callback) ->
		data = formFormat data if data
	
		options = 
			method:	method
			host:	@host
			port:	80
			path:	path
			headers:
				'User-Agent': @userAgent
		
		if data
			options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
			options.headers['Content-Length'] = data.length
		
		if keepAlive
			options.headers['Connection'] = 'Keep-Alive'

		req = http.request options, callback
		req.write data if data
		req.end()


	getAllData = (res, callback) ->
		buffer = []
		res.on 'data', (chunk) -> buffer.push chunk
		res.on 'end', -> callback buffer.join ''
	
	callbackErr = (callback, res) ->
		callback? (if res.statusCode isnt 200 then res.statusCode)
	
	formFormat = (data) ->
		("#{k}=#{v}" for k,v of data).join '&'
	
	start: (callback) ->
		@requestGet '/start', (res) =>
			if res.statusCode isnt 200
				callback? res.statusCode
				return
			
			getAllData res, (data) =>
				# strip quotes
				@id = data[1...data.length-1]
				callback()
				@emit 'newid', @id
				@eventsLoop()
		
	send: (msg, callback) ->
		@requestPost '/send', {msg: msg, id: @id}, (res) ->
			callbackErr callback, res
	
	postEvent: (event, callback) ->
		@requestPost "/#{event}", {id: @id}, (res) ->
			callbackErr callback, res	
	
	startTyping: (callback) -> 
		@postEvent 'typing', callback
			
	stopTyping: (callback) ->
		@postEvent 'stopTyping', callback	
		
	disconnect: (callback) ->
		@postEvent 'disconnect', callback
		@id = undefined
		
	
	
	eventsLoop: ->	
		@requestKA '/events', {id: @id}, (res) =>
			if res.statusCode is 200			
				getAllData res, (eventData) =>
					@eventReceived eventData
	
	eventReceived: (data) ->		
		data = JSON.parse data
		if data?
			for event in data
				@emit.apply this, event
		
		@eventsLoop() if @id
		
		

exports.Omegle = Omegle
