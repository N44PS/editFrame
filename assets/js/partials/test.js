// function AnimEdit (canvas, video, frameVideo){
	
// 	this.canvas = canvas;
// 	this.video = video;
// 	this.frameVideo = frameVideo;
// 	this.width = canvas.width;
// 	this.height = canvas.height;
// 	this.points = [];
// 	this.valid = false;
// 	this.ctx = canvas.getContext('2d');
// 	this.dragging = false;
// 	this.dragoffx = 0;
// 	this.dragoffy = 0;
// 	this.hover = false;
// 	this.selection = null;
// 	this.interval = 30;

// 	var myState = this;

// 	canvas.addEventListener('mousemove',function(e){
// 		myState.cursor(e);
// 		if(myState.dragging){
// 			var mouse = myState.getMouse(e);
// 			if(myState.selection!==null){
// 				var points = myState.points, l = points.length;
// 				myState.selection.x = mouse.x - myState.dragoffx;
// 				myState.selection.y = mouse.y - myState.dragoffy;
// 				myState.valid = true;
// 			}
// 		}
// 	}, false);

// 	canvas.addEventListener('mousedown',function(e){
// 		var mouse = myState.getMouse(e), frame = video.get();
// 		if(myState.hover){
// 			var points = myState.points, l = points.length;
// 			for (var i = l - 1; i >= 0; i--) {
// 				if(points[i].contains(mouse)){
// 					if(myState.selection)
// 						myState.selection.selected = false;
// 					myState.selection = points[i];
// 					myState.selection.selected = true;
// 				}
// 			}
// 			myState.canvas.className = "dragging";
// 			myState.dragging = true;
// 			myState.dragoffx = mouse.x - myState.selection.x;
// 			myState.dragoffy = mouse.y - myState.selection.y;
// 			video.seekTo({'frame':myState.selection.frame}, myState.frameVideo.triggerFrameUpdate);
// 			myState.valid = true;
// 		}
// 	}, false);

// 	canvas.addEventListener('mouseup',function(e){
// 		var frame = video.get(), mouse = myState.getMouse(e), point = myState.getPoint(frame);
// 		if(!myState.dragging && !point){
// 			myState.addShape(new Point(mouse.x, mouse.y, frame,4));
// 		}else if(!myState.dragging && typeof(point) === "object"){
// 			point.x = mouse.x;
// 			point.y = mouse.y;
// 		}
// 		myState.dragging = false;
// 		myState.valid = true;
// 	}, false);

// 	window.addEventListener("keydown", function (e) {
// 		var frame = myState.video.get(), point;
//         if (e.keyCode === 37) { // left
//         	frame--;
//             myState.video.seekBackward(1, myState.frameVideo.triggerFrameUpdate);
//             point = myState.getPoint(frame);
//         } else if (e.keyCode === 39) { // right
//         	frame++;
//             myState.video.seekForward(1, myState.frameVideo.triggerFrameUpdate);
//             point = myState.getPoint(frame);
//         }
//         if(myState.selection){
// 			myState.selection.selected = false;
// 		}
// 		myState.selection = point;
// 		myState.selection.selected = true;
// 		myState.valid = true;
		
//     }, true);

// 	setInterval(function() { myState.draw(); }, myState.interval);
// }

// AnimEdit.prototype = {
// 	constructor : AnimEdit,
// 	addShape : function (shape){
// 		var l = this.points.length;
// 		this.points[l] = shape;
// 		this.valid = true;
// 		this.video.seekForward(1, this.frameVideo.triggerFrameUpdate);
// 	},
// 	draw : function () {
// 		if(this.valid){
// 			var ctx = this.ctx, points = this.points, l = points.length, pts=[];
// 			this.clear();
// 			for (var i = l - 1; i >= 0; i--) {
// 				pts[pts.length]=points[i].x;
// 				pts[pts.length]=points[i].y;
// 			}
// 			this.drawSpline(ctx,pts,0.5,false);
// 			for (var i = l - 1; i >= 0; i--) {
// 				points[i].draw(ctx);
// 			}	
// 			this.valid = false;
// 		}
// 	},
// 	clear : function () {
// 		this.ctx.clearRect(0, 0, this.width, this.height);
// 	},
// 	cursor : function (e){
// 		var mouse = this.getMouse(e), points = this.points, l = points.length, found = false, h = this.hover;
// 		for (var i = l - 1; i >= 0; i--) {
// 			if(points[i].contains(mouse)){
// 				found = true;
// 			}
// 		}
// 		if (!found && h){
// 			this.canvas.className = "";
// 			this.hover = false;
// 		}else if(found && !h){
// 			this.canvas.className = "hover";
// 			this.hover = true;
// 		}
// 	},
// 	getMouse : function (e) {
// 		var element = this.canvas, offsetX = element.offsetParent.offsetLeft, offsetY = element.offsetParent.offsetTop;
// 		return {
// 			x : e.pageX - offsetX,
// 			y : e.pageY - offsetY
// 		};
// 	},
// 	getPoint : function (frame){
// 		var points = this.points, l = points.length
// 	    for (var i=0; i < l; i++) {
// 	        if (points[i].frame === frame) {
// 	            return points[i];
// 	        }
// 	    }
// 	    return false;
// 	},
// 	getControlPoints : function (x0,y0,x1,y1,x2,y2,t){
// 	    var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2)),
// 	    	d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	   
// 	    	fa=t*d01/(d01+d12);
// 	    	fb=t-fa;
	  
// 	    	p1x=x1+fa*(x0-x2);
// 	    	p1y=y1+fa*(y0-y2);

// 	    	p2x=x1-fb*(x0-x2);
// 	    	p2y=y1-fb*(y0-y2);  
	    
// 	    return [p1x,p1y,p2x,p2y];
// 	},
// 	drawSpline : function (ctx,pts,t,closed){
// 	    ctx.lineWidth=1;
// 	    ctx.save();
// 	    var cp=[];   // array of control points, as x0,y0,x1,y1,...
// 	    var n=pts.length;

// 	    if(closed){
// 	        //   Append and prepend knots and control points to close the curve
// 	        pts.push(pts[0],pts[1],pts[2],pts[3]);
// 	        pts.unshift(pts[n-1]);
// 	        pts.unshift(pts[n-1]);
// 	        for(var i=0;i<n;i+=2){
// 	            cp=cp.concat(this.getControlPoints(pts[i],pts[i+1],pts[i+2],pts[i+3],pts[i+4],pts[i+5],t));
// 	        }
// 	        cp=cp.concat(cp[0],cp[1]);   
// 	        for(var i=2;i<n+2;i+=2){
// 	            var color=color="#555555";
// 	            ctx.strokeStyle="#000fff";       
// 	            ctx.beginPath();
// 	            ctx.moveTo(pts[i],pts[i+1]);
// 	            ctx.bezierCurveTo(cp[2*i-2],cp[2*i-1],cp[2*i],cp[2*i+1],pts[i+2],pts[i+3]);
// 	            ctx.stroke();
// 	            ctx.closePath();
// 	        }
// 	    }else{  
// 	        // Draw an open curve, not connected at the ends
// 	        for(var i=0;i<n-4;i+=2){
// 	            cp=cp.concat(this.getControlPoints(pts[i],pts[i+1],pts[i+2],pts[i+3],pts[i+4],pts[i+5],t));
// 	        }    
// 	        for(var i=2;i<pts.length-5;i+=2){
// 	            var color=color="#555555";
// 	            ctx.strokeStyle=="#000fff";        
// 	            ctx.beginPath();
// 	            ctx.moveTo(pts[i],pts[i+1]);
// 	            ctx.bezierCurveTo(cp[2*i-2],cp[2*i-1],cp[2*i],cp[2*i+1],pts[i+2],pts[i+3]);
// 	            ctx.stroke();
// 	            ctx.closePath();
// 	        }
// 	        //  For open curves the first and last arcs are simple quadratics.
// 	        var color="#555555"  // brown
// 	        ctx.strokeStyle=="#000fff";  
// 	        ctx.beginPath();
// 	        ctx.moveTo(pts[0],pts[1]);
// 	        ctx.quadraticCurveTo(cp[0],cp[1],pts[2],pts[3]);
// 	        ctx.stroke();
// 	        ctx.closePath();
	        
// 	        var color="#555555"  // brown
// 	        ctx.strokeStyle=="#000fff";  
// 	        ctx.beginPath();
// 	        ctx.moveTo(pts[n-2],pts[n-1]);
// 	        ctx.quadraticCurveTo(cp[2*n-10],cp[2*n-9],pts[n-4],pts[n-3]);
// 	        ctx.stroke();
// 	        ctx.closePath();
// 	    }
// 	    ctx.restore();
// 	}
// }

// var anim = new AnimEdit(document.getElementById('canvas'), video, frameVideo);