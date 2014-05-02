var Arena = function (width, height) {
	this.width = width;
	this.height = height;
};

Arena.prototype.isOutside = function (player) {
	return player.head.x < 0
		|| player.head.x > this.width
		|| player.head.y < 0
		|| player.head.y > this.height;
};

module.exports = Arena;