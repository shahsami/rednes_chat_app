var express = require('express');
//var request = require('request');
//var url = require('url');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(client) {
	console.log('Client connected..');

	client.on('join', function(name) {
			
			client.nickname = name; // set the nickname associated with the client
		});

	client.on('messages', function(data) { //listen for messages e
		var nickname = client.nickname; //get the nickname of the client
		//console.log(data);

		client.broadcast.emit("message", nickname + ": " + message); //broadcast with name and message
		client.emit("messages", nickname + ": " + message); //send the message back to out client

	});
	

	//client.emit('messages', {hello:'hello you!'});
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
server.listen(8080);