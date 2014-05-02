var Point = function (x, y) {
	this.x = x;
	this.y = y;
};

Point.getRandom = function (maxX, maxY) {
	var x = Math.random() * maxX;
	var y = Math.random() * maxY;
	return new Point(x, y);
};

module.exports = Point;