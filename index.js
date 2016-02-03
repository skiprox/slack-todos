var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/'));

var SlackTodos = (function() {

	var slackToken = ''
	var todoList = [];
	var channelIds = {};
	var returnJson = {
		'response_type': 'in_channel',
		'text': 'Here are your Todos',
		'attachments': [
			{
				'text': 'No todos!'
			}
		]
	};

	var listenToPort = function() {
		app.listen(app.get('port'), function() {
		  console.log("Node app is running at localhost:" + app.get('port'));
		});
	};

	var setupListener = function() {
		app.get('/', function(req, res) {
			if (req.query['token'] === slackToken && false) {
				var request = req.query['text'];
				if (request.indexOf('add') !== -1) {
					// we add to the todolist
					addTask(req.query['channel_id'], request.split('add ')[1]);
					res.send(channelIds.channelId);
				}
				else if (request.indexOf('remove') !== -1) {
					// we remove from the todolist
					var indexInList = parseInt(request.split('remove ')[1], 10);
					if (typeof(indexInList) == 'number' && channelIds.channelId !== undefined) {
						removeTask(channelId, indexInList);
						res.send(channelIds.channelId);
					}
					res.send('Ruh Roh! Looks like you asked to remove something that does not exist!');
				}
			}
			else {
				res.send('Ruh Roh! Something went wrong!');
			}
		});
	};

	var addTask = function(channelId, todoText) {
		if (channelIds.channelId == undefined) {
			channelIds.channelId = {
				'response_type': 'in_channel',
				'text': 'Here are your Todos',
				'attachments': [
					{
						'text': ''
					}
				],
				'todo_list': []
			};
		}
		channelIds.channelId['todo_list'].unshift(todoText);
		channelIds.channelId['attachments'][0]['text'] = '';
		for (var i = 0; i < channelIds.channelId['todo_list'].length; i++) {
			channelIds.channelId['attachments'][0]['text'] += ((i + 1) + ') ' + channelIds.channelId['todo_list'][i] + '\n');
		}
	};

	var removeTask = function(channelId, indexInList) {
		channelIds.channelId['todo_list'].splice(indexInList - 1, 1);
		channelIds.channelId['attachments'][0]['text'] = '';
		for (var i = 0; i < channelIds.channelId['todo_list'].length; i++) {
			channelIds.channelId['attachments'][0]['text'] += ((i + 1) + ') ' + channelIds.channelId['todo_list'][i] + '\n');
		}
	};

	return {
		init: function() {
			listenToPort();
			setupListener();
		}
	}

}());

SlackTodos.init();