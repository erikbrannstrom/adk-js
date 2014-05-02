var Arena = function (width, height) {
	this.width = width;
	this.height = height;
};

Arena.prototype.isOutside = function (point) {
	return point.x < 0
		|| point.x > this.width
		|| point.y < 0
		|| point.y > this.height;
};

module.exports = Arena;