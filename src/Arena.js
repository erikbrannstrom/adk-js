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

module.exports = Arena;