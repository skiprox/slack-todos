var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/'));

var SlackTodos = (function() {

	var slackToken = ''
	var UserIds = {};
	var userId = null;
	var request = null;

	var listenToPort = function() {
		app.listen(app.get('port'), function() {
		  console.log("Node app is running at localhost:" + app.get('port'));
		});
	};

	var setupListener = function() {
		app.get('/', function(req, res) {
			if (req.query['token'] === slackToken) {
				request = req.query['text'];
				userId = req.query['user_id'];
				// Create the user response if undefined
				if (UserIds[userId] == undefined) {
					UserIds[userId] = {
						'response_type': 'in_channel',
						'text': 'Here are your Todos',
						'userId': userId,
						'attachments': [
							{
								'text': ''
							}
						],
						'todo_list': []
					};
				}
				// If the request is to add a todo
				if (request.indexOf('add') !== -1) {
					// we add to the todolist
					addTask(request.split('add ')[1]);
					res.send(UserIds[userId]);
				}
				// If the request is to remove a todo
				else if (request.indexOf('remove') !== -1) {
					// we remove from the todolist
					var indexInList = parseInt(request.split('remove ')[1], 10);
					if (typeof(indexInList) == 'number') {
						removeTask(indexInList);
						res.send(UserIds[userId]);
					}
					res.send('Ruh Roh! Looks like you asked to remove something that does not exist!');
				}
				// If the request is to view the todos
				else if (request.indexOf('view') !== -1) {
					res.send(UserIds[userId]);
				}
				else {
					res.send('Sorry, that is not a valid request.');
				}
			}
			else {
				res.send('Ruh Roh! Something went wrong!');
			}
		});
	};

	var addTask = function(todoText) {
		UserIds[userId]['todo_list'].unshift(todoText);
		regenerateTaskText();
	};

	var removeTask = function(indexInList) {
		UserIds[userId]['todo_list'].splice(indexInList - 1, 1);
		regenerateTaskText();
	};

	var regenerateTaskText = function() {
		UserIds[userId]['attachments'][0]['text'] = '';
		for (var i = 0; i < UserIds[userId]['todo_list'].length; i++) {
			UserIds[userId]['attachments'][0]['text'] += ((i + 1) + ') ' + UserIds[userId]['todo_list'][i] + '\n');
		}
	}

	return {
		init: function() {
			listenToPort();
			setupListener();
		}
	}

}());

SlackTodos.init();