function Spline(pts, color, color2){
	this.points = pts;
	this.color = color || "#666666";
	this.colorSelected = color2 || "#000000";
	this.selected = false;
}

Spline.prototype = {
	constructor: Spline,
	addShape : function (shape){
		var l = this.points.length;
		this.points[l] = shape;
		if(this.points[l-1] && this.points[l-1].frame>shape.frame)
			this.points.sort(this.compare);
	},
	removeShape : function (frame){
		var pt = this.getPoint(frame,true);
		this.points.splice(pt, 1);
		return this.points[pt--];
	},
	compare : function (a, b){
		return a.frame - b.frame;
	},
	getPoint : function (frame, pos){
		var points = this.points, l = points.length
	    for (var i=0; i < l; i++) {
	        if (points[i].frame === frame) {
	        	return pos ? i : points[i];
	        }
	    }
	    return false;
	},
	getControlPoints : function (x0,y0,x1,y1,x2,y2,t){
	    var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2)),
	    	d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	    	fa=t*d01/(d01+d12);
	    	fb=t-fa;
	    	p1x=x1+fa*(x0-x2);
	    	p1y=y1+fa*(y0-y2);
	    	p2x=x1-fb*(x0-x2);
	    	p2y=y1-fb*(y0-y2);  
	    return [p1x,p1y,p2x,p2y];
	},
	draw : function (ctx,t){
	    ctx.lineWidth=1;
	    ctx.save();
	    var cp=[], n, l = this.points.length, points = this.points, pts = [], color = this.selected ? this.colorSelected : this.color;

	    for (var i = l - 1; i >= 0; i--) {
			pts[pts.length]=points[i].x;
			pts[pts.length]=points[i].y;
		}

		n = pts.length;
	    
        // Draw an open curve, not connected at the ends
        for(var i=0;i<n-4;i+=2){
            cp=cp.concat(this.getControlPoints(pts[i],pts[i+1],pts[i+2],pts[i+3],pts[i+4],pts[i+5],t));
        }    
        for(var i=2;i<pts.length-5;i+=2){
            ctx.strokeStyle=this.selected?this.colorSelected:this.color;        
            ctx.beginPath();
            ctx.moveTo(pts[i],pts[i+1]);
            ctx.bezierCurveTo(cp[2*i-2],cp[2*i-1],cp[2*i],cp[2*i+1],pts[i+2],pts[i+3]);
            ctx.stroke();
            ctx.closePath();
        }
        //  For open curves the first and last arcs are simple quadratics.
        ctx.strokeStyle=color;  
        ctx.beginPath();
        ctx.moveTo(pts[0],pts[1]);
        ctx.quadraticCurveTo(cp[0],cp[1],pts[2],pts[3]);
        ctx.stroke();
        ctx.closePath();
        
        ctx.strokeStyle=color;  
        ctx.beginPath();
        ctx.moveTo(pts[n-2],pts[n-1]);
        ctx.quadraticCurveTo(cp[2*n-10],cp[2*n-9],pts[n-4],pts[n-3]);
        ctx.stroke();
        ctx.closePath();
    
	    ctx.restore();
	    for (var i = l - 1; i >= 0; i--) {
			this.points[i].draw(ctx);
		}
	}
}