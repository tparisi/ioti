LeapController = function() {
	
	var controller = new Leap.Controller({enableGestures: true});
	this.latestFrame = null;
	this.paused = false;
	this.lastPitch = 0;
	this.lastYaw = 0;
	this.lastRoll = 0;
	this.lastPosX = 0;
	this.lastPosY = 0;
	this.lastPosZ = 0;
	this.lastFrameTime = 0;
	
    controller.on('ready', function() {
        console.log("ready");
    });
    controller.on('connect', function() {
        console.log("connect");
    });
    controller.on('disconnect', function() {
        console.log("disconnect");
    });
    controller.on('focus', function() {
        console.log("focus");
    });
    controller.on('blur', function() {
        console.log("blur");
    });
    controller.on('deviceConnected', function() {
        console.log("deviceConnected");
    });
    controller.on('deviceDisconnected', function() {
        console.log("deviceDisconnected");
    });
    
    this.controller = controller;
}

LeapController.prototype = new Object;

LeapController.PYR_EPSILON = 0.01; // device units
LeapController.XYZ_EPSILON = 1; // device units
LeapController.MIN_FRAME_TIME = 33; // ms

LeapController.prototype.run = function() {	
    var that = this;
	this.controller.loop(function(frame) {
		that.handleFrame(frame);
	});
}

LeapController.prototype.handleFrame = function(frame) {
    this.latestFrame = frame;

    if (this.paused) {
      return;
    }

    var now = Date.now();
    var frameTime = now - this.lastFrameTime;
    if (frameTime < LeapController.MIN_FRAME_TIME)
    	return;
    
    this.lastFrameTime = now;
    
    var rotationChanged = false,
    	positionChanged = false;

    for (g in frame.gestures) {
    	var gesture = frame.gestures[g];
    	switch (gesture.type) {
	    	case "swipe" :
		    	if (gesture.direction) {
			    	if (this.swipeCallback)
			    		this.swipeCallback(gesture.direction, gesture.speed);
		    	}
	    		break;
    		
	    	case "screenTap" :
	    		if (gesture.position) {
	        		console.log("Screen tap: ", gesture.position);
	    		}
	    		break;

	    	case "keyTap" :
	    		if (gesture.position) {
	        		console.log("Key tap: ", gesture.position);
			    	if (this.keyTapCallback)
			    		this.keyTapCallback(gesture.position);
	    		}
	    		break;
	    		
	    	case "circle" :
	    		if (gesture.center) {
	        		console.log("Circle: ", gesture.center);
			    	if (this.circleCallback)
			    		this.circleCallback(gesture.center, gesture.normal);
	    		}
	    		break;
	    		
	    	default :
	    		console.log("Gesture: ", gesture.type);
	    		break;
    	}    	
    }
    
    return;
    
    for (var i in frame.handsMap) {
      var hand = frame.handsMap[i];
      var pitch = hand.pitch();
      var yaw = hand.yaw();
      var roll = hand.roll();
      
      
      if (Math.abs(pitch - this.lastPitch) > LeapController.PYR_EPSILON ||
    		  Math.abs(yaw - this.lastYaw) > LeapController.PYR_EPSILON ||
    		  Math.abs(roll - this.lastRoll) > LeapController.PYR_EPSILON) {
	
	      this.lastPitch = pitch;
	      this.lastYaw = yaw;
	      this.lastRoll = roll;
	      rotationChanged = true;
      }
      else
    	  ; // console.log("Filtered...");

      var posX = (hand.palmPosition[0]);
      var posY = (hand.palmPosition[1]);
      var posZ = (hand.palmPosition[2]);
      if (Math.abs(posX - this.lastPosX) > LeapController.XYZ_EPSILON ||
    		  Math.abs(posY - this.lastPosY) > LeapController.XYZ_EPSILON ||
    		  Math.abs(posZ - this.lastPosZ) > LeapController.XYZ_EPSILON) {
	
	      this.lastPosX = posX;
	      this.lastPosY = posY;
	      this.lastPosZ = posZ;
	      positionChanged = true;
      }
    
    }
    
    if (rotationChanged) {
        if (this.rotationChangedCallback) {
        	this.rotationChangedCallback(pitch, yaw, roll);
        }
    }
    
    if (positionChanged) {
        if (this.positionChangedCallback) {
        	this.positionChangedCallback(posX, posY, posZ);
        }
    }
}
