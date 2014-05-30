var Player = require('./Player');
var Game = require('./Game');
var React = require('react');
var Players = require('./component/Players');

window.onload = function () {
	React.renderComponent(Players({ onSubmit: initGame }), document.querySelector('#setup'));

	function initGame (players) {
		document.querySelector('#setup').classList.add('hidden');
		document.querySelector('#game').classList.remove('hidden');

		if (players.length === 0) {
			players = [];
			players.push(new Player('First', 37, 39, '#f00'));
			players.push(new Player('Second', 65, 68, '#00f'));
		}
		var game = new Game(players);
		game.setup('.canvasContainer');
	}
};