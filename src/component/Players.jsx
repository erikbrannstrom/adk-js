var React = require('react');

var Players = React.createClass({
	render: function() {
		return (
			<div>
				<h2>PLAYERS</h2>
				<ul>
					<li id="player1">
						<input type="text" placeholder="Player 1" className="name" />
						<input type="text" placeholder="Left" className="keySelector left" />
						<input type="hidden" className="left" />
						<input type="text" placeholder="Right" className="keySelector right" />
						<input type="hidden" className="right" />
					</li>
					<li id="player2">
						<input type="text" placeholder="Player 2" className="name" />
						<input type="text" placeholder="Left" className="keySelector left" />
						<input type="hidden" className="left" />
						<input type="text" placeholder="Right" className="keySelector right" />
						<input type="hidden" className="right" />
					</li>
				</ul>
				<button>Play</button>
			</div>
		);
	}
});

module.exports = Players;