var express = require('express');
//var request = require('request');
//var url = require('url');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var messages =[];
var redis = require('redis');
var client = redis.createClient();
var storeMessage = function(name, data){
	messages.push({name: name, data: data}); //add message to end of array
	if (messages.length > 10) {
		messages.shift(); // if more than 10 message long, remove the first one
	}
}

io.on('connection', function(client) {
	//console.log('Client connected..');

	client.on('join', function(name) {

		client.set('nickname', name);
		client.broadcast.emit("chat", name + " joined the chat");

			//client.nickname = name; // set the nickname associated with the client
		//iterate through message array and emit a message on the connceting client for each one
		messages.forEach(function(message) {
			client.emit("messages", message.name + ": " + message.data);
		});
		});

	client.on('messages', function(message) { //listen for messages e
		//var nickname = client.nickname; //get the nickname of the client
		client.get("nickname", function(error, name) {
			client.broadcast.emit("message", nickname +": " + message); //broadcast with name and message
			client.emit("messages", nickname +": " + message); //send the message back to out client
			storeMessage(name, message);// when client sends a message ..call storeMessage
		});
		//console.log(data);
		
	});
	
	//client.emit('messages', {hello:'hello you!'});
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
server.listen(8080);