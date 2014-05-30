var React = require('react');
var PlayerModel = require('../Player');

var Player = React.createClass({
	getPlayer: function () {
		var item = this.getDOMNode();
		var name = item.querySelector('input.name').value;
		if (name === '') {
			return null;
		}
		var left = parseInt(item.querySelector('input[type="hidden"].left').value, 10);
		var right = parseInt(item.querySelector('input[type="hidden"].right').value, 10);
		return new PlayerModel(name, left, right);
	},

	componentDidMount: function () {
		var selectors = this.getDOMNode().querySelectorAll('.keySelector');
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
	},

	render: function () {
		return (
			<div>
				<input type="text" ref="name" placeholder={ "Player " + this.props.id } className="name" />
				<input type="text" placeholder="Left" className="keySelector left" />
				<input type="hidden" ref="left" className="left" />
				<input type="text" placeholder="Right" className="keySelector right" />
				<input type="hidden" ref="right" className="right" />
			</div>
		);
	}
});

module.exports = Player;