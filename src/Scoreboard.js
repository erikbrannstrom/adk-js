var WIN_SCORE = 10;
var WIN_SCORE_MARGIN = 2;

var Scoreboard = function (players) {
	this.players = players;
};

Scoreboard.prototype.getWinner = function () {
	var first, firstScore = 0, second, secondScore = 0;

	this.players.forEach(function (player) {
		if (player.score >= firstScore) {
			second = first;
			secondScore = firstScore;
			first = player;
			firstScore = player.score;
		} else if (player.score >= secondScore) {
			second = player;
			secondScore = player.score;
		}
	});

	if (first.score >= WIN_SCORE && (first.score - second.score) >= WIN_SCORE_MARGIN) {
		return first;
	}
	return null;
};

Scoreboard.prototype.update = function () {
	var board = document.querySelector('ul.players');
	while (board.hasChildNodes()) {
		board.removeChild(board.lastChild);
	}
	var list = [].concat(this.players);
	list.sort(function (a, b) {
		return b.score - a.score;
	});
	list.forEach(function (player) {
		var li = document.createElement('li');
		var name = document.createElement('span');
		name.classList.add('name');
		name.style.color = player.color;
		name.textContent = player.name;
		var score = document.createElement('span');
		score.classList.add('score');
		score.textContent = player.score;
		li.appendChild(name);
		li.appendChild(score);
		board.appendChild(li);
	});
};

module.exports = Scoreboard;