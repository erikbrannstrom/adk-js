var Point = require('./Point');
var Rectangle = require('./Rectangle');

var Player = function (name, left, right) {
	this.isAlive = true;
	this.name = name;
	this.score = 0;
	this.leftButton = left;
	this.rightButton = right;
	this.direction = Math.random()*360;
	this.speed = 1;
	this.color = '#000';
	this.tail = [];
	this.head = null;
	this.tickCounter = 0;
};

var BASE_SPEED = 1.0;
var TURN_SPEED = 0.05;
var THRESHOLD = 3;
var TICKS_UNTIL_GAP = 400;
var GAP_TICKS = 20;
Player.prototype = {
	move: function () {
		if (this.tickCounter < TICKS_UNTIL_GAP) {
			this.tail.push(this.head);
		}
		var x = this.head.x + Math.cos(this.direction) * this.speed * BASE_SPEED;
		var y = this.head.y + Math.sin(this.direction) * this.speed * BASE_SPEED;
		this.head = new Point(x, y);
		if (this.tickCounter === TICKS_UNTIL_GAP + GAP_TICKS) {
			this.tickCounter = 0;
		} else {
			this.tickCounter++;
		}
	},
	render: function (ctx) {
		// Clear rect around head
		var rect = new Rectangle(this.head.x - 5, this.head.y - 5, 10, 10);
		ctx.clearRect(rect.x , rect.y, rect.width, rect.height);

		// Draw body
		this.tail.forEach(function (point) {
			if (!rect.contains(point)) {
				return;
			}
			ctx.beginPath();
			ctx.arc(point.x, point.y, 1.5, 0, 2 * Math.PI, false);
			ctx.fillStyle = this.color;
			ctx.fill();
		}, this);

		// Draw head
		ctx.beginPath();
		ctx.fillStyle = '#000';
		ctx.arc(this.head.x, this.head.y, 1.5, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.fill();
	},
	turnRight: function () {
		this.direction = this.direction + TURN_SPEED * this.speed;
	},
	turnLeft: function () {
		this.direction = this.direction - TURN_SPEED * this.speed;
	},
	hit: function (players) {
		return players.some(function (other) {
			var length = other.tail.length;
			if (other === this) {
				length = length - 10;
			}
			for (var i = 0; i < length; i++) {
				if (Math.abs(this.head.x - other.tail[i].x) < THRESHOLD
					&& Math.abs(this.head.y - other.tail[i].y) < THRESHOLD) {
					return true;
				}
			}
		}, this);
	},
	reset: function (startPos) {
		this.isAlive = true;
		this.direction = Math.random()*360;
		this.tail = [];
		this.head = startPos;
		this.tickCounter = 0;
	}
};

module.exports = Player;