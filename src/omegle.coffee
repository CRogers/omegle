EventEmitter = require('events').EventEmitter
http = require('http')
fs = require('fs')
qs = require('qs');

# Get version from package file
version = 'Unknown'
npmPackage = fs.readFileSync "#{__dirname}/../package.json", 'utf8'
if npmPackage
	version = JSON.parse(npmPackage).version

class Omegle extends EventEmitter

	constructor: (userAgent="omegle node.js npm package/#{version}", host='bajor.omegle.com',language='en',mobile=false) ->
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

	mobileValue = (mobileParam=@mobile) ->
		if mobileParam is true or mobileParam is 1
			return 1
		else
			return 0
	
	start: (callback) ->
		@requestGet '/start?' + qs.stringify({ rcs: 1, firstevents: 1, m: mobileValue(@mobile), lang: @language }), (res) =>
			if res.statusCode isnt 200
				callback? res.statusCode
				return
			
			getAllData res, (data) =>
				# strip quotes
				@id = data[1...data.length-1]
				callback()
				@emit 'newid', @id
				@eventsLoop()
				
	getStats: (callback) ->
		@requestGet '/status?nocache=' + Math.random(), (res) ->
		getAllData res, __bind_((data) ->
		callback JSON.parse(data)
		
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
