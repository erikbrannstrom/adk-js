var React = require('react');
var Player = require('./Player');

var GameSetup = React.createClass({
	getInitialState: function() {
		return {
			numPlayers: 2,
			speed: 1.0
		};
	},

	updateSpeed: function (event) {
		this.setState({ speed: parseFloat(event.target.value) });
	},

	submit: function (event) {
		event.preventDefault();
		var playerList = [];
		var colors = ['#f00', '#00f', '#0f0', '#0ff', '#ff0', '#666'];

		for (var i = 1; i <= this.state.numPlayers; i++) {
			var player = this.refs['player' + i].getPlayer();
			if (player) {
				player.color = colors[i - 1];
				player.speed = this.state.speed;
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
				<h2>Game settings</h2>
				<ul>
					<li>
						<label>Speed:</label>
						<select value={ this.state.speed } onChange={ this.updateSpeed } ref="speed">
							<option value={ 0.5 }>Slow</option>
							<option value={ 1.0 }>Normal</option>
							<option value={ 1.5 }>Fast</option>
						</select>
					</li>
				</ul>
				<button>Play</button>
			</form>
		);
	}
});

module.exports = GameSetup;