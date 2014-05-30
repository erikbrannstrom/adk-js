var React = require('react');
var Player = require('./Player');

var Players = React.createClass({
	getInitialState: function() {
		return {
			numPlayers: 2
		};
	},

	submit: function (event) {
		event.preventDefault();
		var playerList = [];
		var colors = ['#f00', '#00f', '#0f0', '#0ff', '#ff0', '#666'];

		for (var i = 1; i <= this.state.numPlayers; i++) {
			var player = this.refs['player' + i].getPlayer();
			if (player) {
				player.color = colors[i - 1];
				playerList.push(player);
			}
		}

		this.props.onSubmit(playerList);
	},

	render: function () {
		return (
			<form onSubmit={ this.submit }>
				<h2>Players</h2>
				<ul>
					<li><Player ref="player1" id={ 1 } /></li>
					<li><Player ref="player2" id={ 2 } /></li>
				</ul>
				<button>Play</button>
			</form>
		);
	}
});

module.exports = Players;