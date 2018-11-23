var redis = require('redis');
var client = redis.createClient();

client.set('message1', 'hello, this is dog');
client.set('message2', 'well this is spider');

client.get('message1', function(err, reply) {
	console.log(reply);
});