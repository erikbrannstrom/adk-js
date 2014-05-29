var Point = require('./Point');

var Arena = function (width, height) {
	this.width = width;
	this.height = height;
};

var ARENA_MARGIN = 75;

Arena.prototype.isOutside = function (point) {
	return point.x < 0
		|| point.x > this.width
		|| point.y < 0
		|| point.y > this.height;
};

Arena.prototype.paint = function (ctx) {
	var style = ctx.strokeStyle;
	ctx.strokeStyle = '#000';
	ctx.moveTo(0, 0);
	ctx.lineTo(this.width, 0);
	ctx.lineTo(this.width, this.height);
	ctx.lineTo(0, this.height);
	ctx.lineTo(0, 0);
	ctx.stroke();
	ctx.strokeStyle = style;
};

Arena.prototype.getRandomStartPosition = function () {
	var start = Point.getRandom(this.width - ARENA_MARGIN * 2, this.height - ARENA_MARGIN * 2);
	start.x = start.x + ARENA_MARGIN;
	start.y = start.y + ARENA_MARGIN;
	return start;
};

module.exports = Arena;