var Player = require('./Player');
var Game = require('./Game');
var React = require('react');
var Players = require('./component/Players');

window.onload = function () {
	var selectors = document.querySelectorAll('.keySelector');
	for (var i = 0; i < selectors.length; i++) {
		selectors[i].addEventListener('keydown', function (event) {
			event.preventDefault();
			event.target.value = (event.key || event.keyIdentifier) === ' ' ? 'space' : (event.key || event.keyIdentifier);
			event.target.blur();
			var hidden;
			if (event.target.classList.contains('left')) {
				hidden = event.target.parentNode.querySelector('input[type="hidden"].left');
				event.target.parentNode.querySelector('.right').focus();
			} else {
				hidden = event.target.parentNode.querySelector('input[type="hidden"].right');
			}
			hidden.value = event.keyCode;
		});
	}

	React.renderComponent(Players({}), document.querySelector('#setup'));

	document.querySelector('#setup button').addEventListener('click', function () {
		var playerSetup = document.querySelectorAll('#setup li');
		var playerList = [];
		var colors = ['#f00', '#0ff', '#00f', '#666'];

		for (var i = 0; i < playerSetup.length; i++) {
			var item = playerSetup[i];
			var name = item.querySelector('input.name').value;
			if (name === '') {
				continue;
			}
			var left = parseInt(item.querySelector('input[type="hidden"].left').value, 10);
			var right = parseInt(item.querySelector('input[type="hidden"].right').value, 10);
			playerList.push(new Player(name, left, right, colors[i]));
		}

		// DEBUG MODE:
		playerList = [];
		playerList.push(new Player('First', 37, 39, colors[0]));
		playerList.push(new Player('Second', 65, 68, colors[1]));

		document.querySelector('#setup').classList.add('hidden');
		document.querySelector('#game').classList.remove('hidden');

		var game = new Game(playerList);
		game.setup('.canvasContainer');
	});
};