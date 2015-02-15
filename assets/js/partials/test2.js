function AnimEdit (canvas, video, frameVideo){
	
	this.canvas = canvas;
	this.video = video;
	this.frameVideo = frameVideo;
	this.width = canvas.width;
	this.height = canvas.height;
	this.splines = [new Spline([])];
	this.valid = false;
	this.ctx = canvas.getContext('2d');
	this.dragging = false;
	this.dragoffx = 0;
	this.dragoffy = 0;
	this.hover = false;
	this.currentPoint = null;
	this.currentSpline = this.splines[0];
	this.currentSpline.selected = true;
	this.interval = 30;

	var myState = this;

	canvas.addEventListener('mousemove',function(e){
		myState.cursor(e);
		if(myState.dragging){
			var mouse = myState.getMouse(e);
			if(myState.currentPoint!==null){
				myState.currentPoint.x = mouse.x - myState.dragoffx;
				myState.currentPoint.y = mouse.y - myState.dragoffy;
				myState.valid = true;
			}
		}
	}, false);

	canvas.addEventListener('mousedown',function(e){
		var mouse = myState.getMouse(e), frame = video.get();
		if(myState.hover){
			var splines = myState.splines, l = splines.length;
			for (var i = l - 1; i >= 0; i--) {
				var points = splines[i].points, j = points.length;
				for (var k = j - 1; k >= 0; k--) {
					if(points[k].contains(mouse)){
						myState.changeCurrent("currentPoint",points[k]);
        				myState.changeCurrent("currentSpline",splines[i]);
					}
				}
			}
			myState.canvas.className = "dragging";
			myState.dragging = true;
			myState.dragoffx = mouse.x - myState.currentPoint.x;
			myState.dragoffy = mouse.y - myState.currentPoint.y;
			video.seekTo({'frame':myState.currentPoint.frame}, myState.frameVideo.triggerFrameUpdate);
			myState.valid = true;
		}
	}, false);

	canvas.addEventListener('mouseup',function(e){
		var frame = video.get(), mouse = myState.getMouse(e), point = myState.currentSpline.getPoint(frame), shape;
		if(!myState.dragging && !point){
			myState.addShape(new Point(mouse.x, mouse.y, frame, 4));
		}else if(!myState.dragging && typeof(point) === "object"){
			point.x = mouse.x;
			point.y = mouse.y;
		}
		myState.dragging = false;
		myState.valid = true;
	}, false);

	$("#newSpline").bind("click", function (a) {
        a.preventDefault();
        var l = myState.splines.length;
        myState.splines[l] = new Spline([]);
        myState.changeCurrent("currentSpline",myState.splines[l]);
    });

	window.addEventListener("keydown", function (e) {
		var point;
		switch (e.keyCode){
			case key.left :
            	key.changeFrame(myState,"left");
				break;
			case key.right :
            	key.changeFrame(myState,"right");
				break;
			case key.up :
				key.changeSpline(myState,"up");
				break;
			case key.down :
				key.changeSpline(myState,"down");
				break;
			case key.space :
				break;
			case key.backspace :
				myState.currentSpline.removeShape(video.get());
				break;
		}
		myState.valid = true;	
    }, true);

	setInterval(function() { myState.draw(); }, myState.interval);
}

AnimEdit.prototype = {
	constructor : AnimEdit,
	addShape : function (shape){
		this.currentSpline.addShape(shape);
		this.valid = true;
		this.video.seekForward(1, this.frameVideo.triggerFrameUpdate);
	},
	draw : function () {
		if(this.valid){
			var ctx = this.ctx, splines = this.splines, l = splines.length;
			this.clear();
			for (var i = l - 1; i >= 0; i--) {
				splines[i].draw(ctx,0.5);
			}	
			this.valid = false;
		}
	},
	clear : function () {
		this.ctx.clearRect(0, 0, this.width, this.height);
	},
	cursor : function (e){
		var mouse = this.getMouse(e), splines = this.splines, l = splines.length, found = false, h = this.hover;
		for (var i = l - 1; i >= 0; i--) {
			var points = splines[i].points, j = points.length;
			for (var k = j - 1; k >= 0; k--) {
				if(points[k].contains(mouse)){
					found = true;
				}
			}
		}
		if (!found && h){
			this.canvas.className = "";
			this.hover = false;
		}else if(found && !h){
			this.canvas.className = "hover";
			this.hover = true;
		}
	},
	getMouse : function (e) {
		var element = this.canvas, offsetX = element.offsetParent.offsetLeft, offsetY = element.offsetParent.offsetTop;
		return {
			x : e.pageX - offsetX,
			y : e.pageY - offsetY
		};
	},
	changeCurrent : function (prop, value){
		if(prop === "currentPoint"){
			if(this.currentPoint){
				this.currentPoint.selected = false;
			}
			this.currentPoint = value;
			this.currentPoint.selected = true;
		}else{
			if(this.currentSpline){
				this.currentSpline.selected = false;
			}
			this.currentSpline = value;
			this.currentSpline.selected = true;
		}
	}
}

var anim = new AnimEdit(document.getElementById('canvas'), video, frameVideo);