var Point = require('./Point');
var Rectangle = require('./Rectangle');
var Arena = require('./Arena');
var Player = require('./Player');

var SHOW_FPS = true;
var players;
var arena;
var drawArena;
var activeButtons = [];
var lastAnimationFrame = null, framesSinceUpdate = 0, fps = 0;
var showFPS;
var resetGame;
var animationId = null;

window.addEventListener('keydown', function (event) {
	var key = (event.key || event.keyIdentifier).toLowerCase();
	var index = activeButtons.indexOf(key);
	if (index === -1) {
		activeButtons.push(key);
	}
});
window.addEventListener('keyup', function (event) {
	var key = (event.key || event.keyIdentifier).toLowerCase();
	var index = activeButtons.indexOf(key);
	activeButtons.splice(index, 1);
});

var updateScoreboard = function () {
	var board = document.querySelector('ul.players');
	while (board.hasChildNodes()) {
		board.removeChild(board.lastChild);
	}
	var list = [].concat(players);
	list.sort(function (a, b) {
		return b.score - a.score;
	});
	list.forEach(function (player) {
		var li = document.createElement('li');
		var name = document.createElement('span');
		name.classList.add('name');
		name.textContent = player.name;
		var score = document.createElement('span');
		score.classList.add('score');
		score.textContent = player.score;
		li.appendChild(name);
		li.appendChild(score);
		board.appendChild(li);
	});
};

var GameLoop = function () {
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = '#fff';
	var repaintAreas = [];
	if (SHOW_FPS) {
		var rect = new Rectangle(0, 0, 100, 40);
		repaintAreas.push(rect);
		ctx.fillRect(rect.x , rect.y, rect.width, rect.height);
	}

	players.forEach(function (player) {
		if (player.isAlive) {
			var rect = new Rectangle(player.head.x - 5, player.head.y - 5, 10, 10);
			repaintAreas.push(rect);
			ctx.fillRect(rect.x , rect.y, rect.width, rect.height);
		}
	});

	var alivePlayers = 0;
	var killedPlayers = 0;
	players.forEach(function (player) {
		player.tail.forEach(function (point) {
			var repaint = repaintAreas.some(function (rect) {
				return rect.contains(point);
			});
			if (!repaint) {
				return;
			}
			ctx.beginPath();
			ctx.arc(point.x, point.y, 1.5, 0, 2*Math.PI, false);
			ctx.fillStyle = player.color;
			ctx.fill();
		});

		ctx.beginPath();
		ctx.fillStyle = '#ff0';
		ctx.arc(player.head.x, player.head.y, 1.5, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.fill();

		if (!player.isAlive) {
			return;
		}

		player.move();
		if (player.hit(players) || arena.isOutside(player.head)) {
			player.isAlive = false;
			killedPlayers++;
			return;
		}
		if (activeButtons.indexOf(player.leftButton) > -1) {
			player.turnLeft();
		}
		if (activeButtons.indexOf(player.rightButton) > -1) {
			player.turnRight();
		}
		alivePlayers++;
	});

	if (killedPlayers > 0) {
		players.forEach(function (player) {
			if (player.isAlive) {
				player.score = player.score + killedPlayers;
			}
			updateScoreboard();
		});
	}

	drawArena(ctx);
	if (SHOW_FPS) {
		showFPS(ctx);
	}

	if (alivePlayers <= 1) {
		resetGame(ctx);
		return;
	}

	animationId = window.requestAnimationFrame(GameLoop);
};

resetGame = function (ctx) {
	window.cancelAnimationFrame(animationId);
	ctx.fillStyle = "black";
	ctx.font = "normal 26pt Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "normal 28pt Arial";
	ctx.fillText("PRESS SPACE", ctx.canvas.width / 2, ctx.canvas.height / 2);
	var listener = function (event) {
		if (event.keyCode === 32) {
			window.removeEventListener('keyup', listener);
			players.forEach(function (player) {
				player.reset(Point.getRandom(arena.width, arena.height));
			});
			ctx.fillStyle = '#fff';
			ctx.fillRect(0 , 0, arena.width, arena.height);
			window.requestAnimationFrame(GameLoop);
		}
	};
	window.addEventListener('keyup', listener);
};

showFPS = function (ctx) {
	var now = Date.now();
	framesSinceUpdate++;
	if (framesSinceUpdate === 10) {
		if (lastAnimationFrame) {
			fps = Math.round(1000 * 10 / (now - lastAnimationFrame));
		}
		lastAnimationFrame = now;
		framesSinceUpdate = 0;
	}

	ctx.fillStyle = "black";
	ctx.font = "normal 16pt Arial";
	ctx.textAlign = "left";
	ctx.fillText(fps + " fps", 10, 26);
}

drawArena = function (ctx) {
	var style = ctx.strokeStyle;
	ctx.strokeStyle = '#000';
	ctx.moveTo(0, 0);
	ctx.lineTo(arena.width, 0);
	ctx.lineTo(arena.width, arena.height);
	ctx.lineTo(0, arena.height);
	ctx.lineTo(0, 0);
	ctx.stroke();
	ctx.strokeStyle = style;
};

var startGame = function (playerList) {
	var canvas = document.querySelector('canvas');
	var canvasContainer = document.querySelector('.canvasContainer');
	var ctx = canvas.getContext("2d");
	var setCanvasSize = function () {
		canvas.width = canvasContainer.offsetWidth;
		canvas.height = canvasContainer.offsetHeight;
	};
	setCanvasSize();
	arena = new Arena(canvas.width, canvas.height);

	var colors = ['#f00', '#0ff', '#00f', '#666'];
	players = [];
	playerList.forEach(function (player, index) {
		players.push(new Player(player.name, player.left, player.right, Point.getRandom(arena.width, arena.height), colors[index]));
	})
	updateScoreboard();
	window.requestAnimationFrame(GameLoop);
};

window.onload = function () {
	var selectors = document.querySelectorAll('.keySelector');
	for (var i = 0; i < selectors.length; i++) {
		selectors[i].addEventListener('keydown', function (event) {
			event.preventDefault();
			event.target.value = (event.key || event.keyIdentifier) === ' ' ? 'space' : (event.key || event.keyIdentifier);
			event.target.dataset.key = (event.key || event.keyIdentifier);
			event.target.blur();
		});
	}
	document.querySelector('#setup button').addEventListener('click', function () {
		var playerSetup = document.querySelectorAll('#setup li');
		var playerList = [];

		for (var i = 0; i < playerSetup.length; i++) {
			var item = playerSetup[i];
			var name = item.querySelector('input.name').value;
			if (name === '') {
				continue;
			}
			var left = item.querySelector('input.left').dataset.key.toLowerCase();
			var right = item.querySelector('input.right').dataset.key.toLowerCase();
			playerList.push({ name: name, left: left, right: right });
		}
		document.querySelector('#setup').classList.add('hidden');
		document.querySelector('#game').classList.remove('hidden');
		startGame(playerList);
	})
};