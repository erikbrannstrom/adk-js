var Point = require('./Point');

var Player = function (name, left, right, startPos, color) {
	this.isAlive = true;
	this.name = name;
	this.score = 0;
	this.leftButton = left;
	this.rightButton = right;
	this.direction = Math.random()*360;
	this.speed = 1;
	this.color = color;
	this.tail = [];
	this.head = startPos;
	this.tickCounter = 0;
};

var BASE_SPEED = 0.8;
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
	turnRight: function () {
		this.direction = this.direction + TURN_SPEED;
	},
	turnLeft: function () {
		this.direction = this.direction - TURN_SPEED;
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
		this.speed = 1;
		this.tail = [];
		this.head = startPos;
		this.tickCounter = 0;
	}
};

module.exports = Player;