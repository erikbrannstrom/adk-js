var Arena = require('./Arena');
var Scoreboard = require('./Scoreboard');

var SHOW_FPS = true;

var Game = function (players) {
	this.animationId = null;
	this.players = players;
	this.baseCanvas = null;
	this.playerCanvases = [];
	this.arena = null;
	this.activeButtons = [];
	this.scoreboard = new Scoreboard(players);
};

Game.prototype.setup = function (selector) {
	var container = document.querySelector(selector);
	var canvas = document.createElement('canvas');
	canvas.width = container.offsetWidth;
	canvas.height = container.offsetHeight;
	this.baseCanvas = canvas;

	this.players.forEach(function (player, index) {
		canvas = document.createElement('canvas');
		canvas.style.zIndex = index + 1;
		canvas.width = container.offsetWidth;
		canvas.height = container.offsetHeight;

		container.appendChild(canvas);
		this.playerCanvases.push(canvas);
	}, this);

	this.baseCanvas.style.zIndex = this.players.length + 1;
	container.appendChild(this.baseCanvas);

	this.arena = new Arena(container.offsetWidth, container.offsetHeight);

	var _this = this;
	window.addEventListener('keydown', function (event) {
		var index = _this.activeButtons.indexOf(event.keyCode);
		if (index === -1) {
			_this.activeButtons.push(event.keyCode);
		}
	});
	window.addEventListener('keyup', function (event) {
		var index = _this.activeButtons.indexOf(event.keyCode);
		if (index !== -1) {
			_this.activeButtons.splice(index, 1);
		}
	});

	this.reset();
};

Game.prototype.run = function () {
	var ctx;
	var alivePlayers = 0;
	var killedPlayers = 0;

	this.players.forEach(function (player, index) {
		if (!player.isAlive) {
			return;
		}

		ctx = this.playerCanvases[index].getContext('2d');
		player.render(ctx);
		player.move();

		if (player.hit(this.players) || this.arena.isOutside(player.head)) {
			player.isAlive = false;
			killedPlayers++;
			return;
		}
		if (this.activeButtons.indexOf(player.leftButton) > -1) {
			player.turnLeft();
		}
		if (this.activeButtons.indexOf(player.rightButton) > -1) {
			player.turnRight();
		}
		alivePlayers++;
	}, this);

	if (killedPlayers > 0) {
		this.players.forEach(function (player) {
			if (player.isAlive) {
				player.score = player.score + killedPlayers;
			}
			this.scoreboard.update();
		}, this);
	}

	if (alivePlayers <= 1) {
		this.reset();
		return;
	}

	if (SHOW_FPS === true) {
		renderFPS(this.baseCanvas.getContext('2d'));
	}

	this.animationId = window.requestAnimationFrame(this.run.bind(this));
};

Game.prototype.reset = function () {
	window.cancelAnimationFrame(this.animationId);
	var ctx = this.playerCanvases[this.playerCanvases.length - 1].getContext('2d');

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "normal 28pt Arial";

	var winner = this.scoreboard.getWinner();
	if (winner !== null) {
		ctx.fillStyle = winner.color;
		ctx.fillText(winner.name + ' wins!', ctx.canvas.width / 2, ctx.canvas.height / 2 - 50);
		ctx.fillText('PRESS SPACE FOR REMATCH', ctx.canvas.width / 2, ctx.canvas.height / 2);
		this.players.forEach(function (player) {
			player.score = 0;
		});
	} else {
		ctx.fillStyle = "black";
		ctx.fillText("PRESS SPACE", ctx.canvas.width / 2, ctx.canvas.height / 2);
	}
	var _this = this;
	var listener = function (event) {
		if (event.keyCode === 32) {
			window.removeEventListener('keyup', listener);
			_this.players.forEach(function (player, index) {
				player.reset(_this.arena.getRandomStartPosition());
				var canvas = _this.playerCanvases[index];
				canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
				_this.arena.render(_this.baseCanvas.getContext('2d'));
			});
			_this.scoreboard.update();
			window.requestAnimationFrame(_this.run.bind(_this));
		}
	};
	window.addEventListener('keyup', listener);
};

var lastAnimationFrame = null, framesSinceUpdate = 0, fps = 0;
function renderFPS (ctx) {
	var UPDATE_FRAME_RATIO = 20;
	var now = Date.now();
	framesSinceUpdate++;
	if (framesSinceUpdate < UPDATE_FRAME_RATIO) {
		return;
	}

	if (lastAnimationFrame) {
		fps = Math.round(1000 * UPDATE_FRAME_RATIO / (now - lastAnimationFrame));
	}
	lastAnimationFrame = now;
	framesSinceUpdate = 0;

	ctx.clearRect(5, 5, 100, 40);
	ctx.fillStyle = "black";
	ctx.font = "normal 16pt Arial";
	ctx.textAlign = "left";
	ctx.fillText(fps + " fps", 10, 26);
}

module.exports = Game;