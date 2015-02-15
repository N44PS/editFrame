var key = {
	left		: 37, 	// left arrow
	right		: 39, 	// right arrow
	up			: 38, 	// up arrow
	down		: 40, 	// down arrow
	space		: 32, 	// space
	backspace	: 8, 	// space
	changeFrame : function(anim, direction){
		var frame = anim.video.get();
		if(direction==="right"){
			frame++;
			anim.video.seekForward(1, anim.frameVideo.triggerFrameUpdate);
		}else{
			frame--;
            anim.video.seekBackward(1, anim.frameVideo.triggerFrameUpdate);
		}
		current = anim.currentSpline.getPoint(frame);
		anim.changeCurrent("currentPoint",current);
	},
	changeSpline : function(anim, direction){
        var splines = anim.splines, l = splines.length, index, frame = anim.video.get(), currentPoint; 
		if(anim.currentSpline){
			index = splines.indexOf(anim.currentSpline)
		}
		direction === "up" ? index-- : index++;
		if(splines[index]){
			anim.changeCurrent("currentSpline",splines[index]);
			currentPoint = anim.currentSpline.getPoint(frame);
			if(currentPoint){
				anim.changeCurrent("currentPoint",currentPoint);
			}else{
				anim.video.seekTo({'frame':anim.currentSpline.points[0].frame}, anim.frameVideo.triggerFrameUpdate);
				currentPoint = anim.currentSpline.points[0];
				anim.changeCurrent("currentPoint",currentPoint);
			}
		}
	}
}