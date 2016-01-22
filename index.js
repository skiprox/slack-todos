var express = require('express');
var app = express();
var slackToken = '';
var todoList = [];
var returnJson = {
	'response_type': 'in_channel',
	'text': 'Here are your Todos',
	'attachments': [
		{
			'text': 'No todos!'
		}
	]
};

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
	if (req.query['token'] === slackToken) {
		var request = req.query['text'];
		if (request.indexOf('add') !== -1) {
			// we add to the todolist
			todoList.unshift(request.split('add ')[1]);
		}
		else if (request.indexOf('remove') !== -1) {
			// we remove from the todolist
			var indexInList = parseInt(request.split('remove ')[1], 10);
			if (typeof(indexInList) == 'number') {
				todoList.splice(indexInList - 1, 1);
			}
		}
		parseText();
		res.send(returnJson);
	}
	else {
		res.send('temporarily broken! please try again later');
	}
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

var parseText = function(channelId) {
	var i;
	var todoListLen = todoList.length;
	returnJson[channelId]['attachments'][0]['text'] = todoList.length !== 0 ? '' : 'No todos!';
	for (i = 0; i < todoList.length; i++) {
		returnJson[channelId]['attachments'][0]['text'] += ((i + 1) + ') ' + todoList[i] + '\n');
	}
};