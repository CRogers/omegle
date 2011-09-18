EventEmitter = require('events').EventEmitter
sys = require('sys')
http = require('http')
fs = require('fs')

# Get version from package file
version = 'Unknown'
package = fs.readFileSync '../package.json', 'utf8'
if package
	version = JSON.parse(package).version

class Omegle extends EventEmitter

	constructor: (userAgent, host) ->
		@userAgent = userAgent || "omegle node.js npm package/#{version}"
		@host = host || 'bajor.omegle.com'
	
	request: (method, path, data, callback) ->
		options = 
			method:	method
			host:	@host
			port:	80
			path:	path
			headers:
				'User-Agent': @userAgent
				'Content-Length': data?.length ? 0
	
		console.log 'Sending request:'
		console.log options
	
		req = http.request options, callback
		if data
			req.write data
		req.end()


	getAllData = (res, callback) ->
		buffer = []
		res.on 'data', (chunk) -> buffer.push chunk
		res.on 'end', -> callback buffer.join ''
	
	start: (err) ->
		@request 'GET', '/start', undefined, (res) =>
			if res.statusCode isnt 200
				if err
					err res.statusCode
				return
			
			getAllData res, (data) =>
				@id = data[1...data.length-1]
				console.log "Got new id: " + @id
				@emit 'start', @id
		
	send: (msg, err) ->
		console.log 'saying ' + msg
		@request 'POST', "/send", "msg=#{msg}&id=#{@id}", (res) ->
			getAllData res, (data) -> console.log data
			if res.statusCode isnt 200
				err res.statusCode
			else
				err()
		
	disconnect: ->
		@emit 'disconnect'

exports.Omegle = Omegle
