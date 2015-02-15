var video = VideoFrame({
    id: 'example_video_1',
    frameRate: FrameRates.film,
    callback: function (response) {
        $('.smtpe span').text(response);
        $('.timecode span').text(video.toTime());
        $('.framenumber span').text(video.get());
    }
}),

frameVideo = {
    init: function () {
            myVideo = videojs('example_video_1', {}, function (){
                this.on("play", function () {
                    video.listen($("#currentMethod").attr("data-video-frame-method"));
                    $("#playButton").html('PAUSE');
                });
                this.on("pause", function () {
                    video.video.currentTime = Math.round(video.video.currentTime * video.frameRate) / video.frameRate + 0.0001; //Get to the beginning of the frame paused
                    video.stopListen();
                    frameVideo.triggerFrameUpdate(); // Refresh the update since we paused
                    $("#playButton").html('PLAY');
                });
                this.on("ended",function () {
                    video.stopListen();
                    $("#playButton").html('PLAY');
                });
            });
        $("#seekBackward").bind("click", function (a) {
            a.preventDefault();
            video.seekBackward(1, frameVideo.triggerFrameUpdate);
        });
        $("#seekForward").bind("click", function (a) {
            a.preventDefault();
            video.seekForward(1, frameVideo.triggerFrameUpdate);
        });
        $("#playButton").bind("click", this.toggleVideo);
    },
    toggleVideo: function () {
        myVideo.paused() ? myVideo.play() : myVideo.pause();
    },
    triggerFrameUpdate: function () {
        $('.smtpe span').text(video.toSMPTE());
        $('.timecode span').text(video.toTime());
        $('.framenumber span').text(video.get());
    }
}

frameVideo.init();