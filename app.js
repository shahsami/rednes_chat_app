var express = require('express');
//var request = require('request');
//var url = require('url');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var messages =[];
var redis = require('redis');
var redisClient = redis.createClient();
var storeMessage = function(name, data){
	// messages.push({name: name, data: data}); //add message to end of array
	// if (messages.length > 10) {
	// 	messages.shift(); // if more than 10 message long, remove the first one
	// }
	var message = JSON.strigify({name: name, data: data}); // trun object into string to store in redis

	redisClient.lpush("messages", message, function(err, response) {
		redisClient.ltrip("messages", 0, 9); // to keep newest 10 items
	});
}

io.on('connection', function(client) {
	//console.log('Client connected..');

	client.on('join', function(name) {

		client.set('nickname', name);
		client.broadcast.emit("chat", name + " joined the chat");

			//client.nickname = name; // set the nickname associated with the client
		redisClient.lrange("messages", 0, -1, function(err, messages){
			messages = messages.reverse(); // reverse to emit in correct order
		});


		//iterate through message array and emit a message on the connceting client for each one
		messages.forEach(function(message) {
			message = JSON.parse(message); // parse into JSON object
			client.emit("messages", message.name + ": " + message.data);
		});

		client.broadcast.emit("add chatter", name); //notify other clients a chatter has joined

		// emit all the currently logged in chatter to the newly connected client
		redisClient.smembers('chatters', function(err, names) {
			console.log(names);
			names.forEach(function(name) {
				client.emit('add chatter', name);
			});
		});



		redisClient.sadd("chatters", name); // add name to redis chatter set
		});

		// removing chatters
		client.on('disconnect', function(name) {
		client.get('nickname', function(err, name) {
			console.log('++chatter leaved : ' + name);
			client.broadcast.emit('remove chatter', name);

			redisClient.srem('chatters', name);	
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

// serve index.html
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
server.listen(8080);