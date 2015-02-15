function Point(x, y, frame, r, fill){
	this.x = x || 0;
	this.y = y || 0;
	this.r = r || 4;
	this.fill = fill || "#ffffff";
	this.frame = frame || 0;
	this.selected = false;
}

Point.prototype = {
	constructor: Point,
	draw : function (ctx) {
		ctx.beginPath();
		ctx.arc(this.x,this.y, this.r, 0, 2 * Math.PI, false);
		ctx.fillStyle = this.fill;
		ctx.fill();
		if(this.selected){
			ctx.lineWidth = 3;
			ctx.strokeStyle = '#000000';
			ctx.stroke();
		}
		ctx.closePath();
	},
	contains : function (m) {
		return (this.x - this.r) <= m.x && (this.x + this.r) >= m.x && (this.y - this.r) <= m.y && (this.y + this.r) >= m.y; 
	}
}