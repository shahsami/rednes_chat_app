var express = require('express');
//var request = require('request');
//var url = require('url');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(client) {
	console.log('Client connected..');

	client.on('messages', function(data) { //listen for messages e
		console.log(data);
		//client.broadcast.emit('messages', data);
	});
	

	//client.emit('messages', {hello:'hello you!'});
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
server.listen(8080);