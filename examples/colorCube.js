ColorCube = function(element) {
	this.app = new Vizi.Application({ container : element });
	var that = this;
	
	element.addEventListener('mousedown', function(event) { that.onMouseDown(event); }, false );
	element.addEventListener('mouseup', function(event) { that.onMouseUp(event); }, false );
	element.addEventListener('mousemove', function(event) { that.onMouseMove(event); }, false );

	this.domElement = element;
	
	this.initScene();
	this.createCubes();	
	
	this.dragging = false;
	this.currentColor = null;
	
	this.lastLeapX = 0;
	this.lastLeapY = 0;
	this.lastLeapZ = 0;
	this.lastLeapPitch = 0;
	this.lastLeapYaw = 0;
	this.lastLeapRoll = 0;
	this.lastMouseEvent = null;
}

ColorCube.prototype = new Object;

ColorCube.prototype.initScene = function() {

	var camobj = new Vizi.Object;
	camera1 = new Vizi.PerspectiveCamera({active:true});
	camobj.addComponent(camera1);
	this.app.addObject(camobj);

	var controller = Vizi.Prefabs.ModelController({active:true, allowZoom:false, headlight:true});
	var controllerScript = controller.getComponent(Vizi.ModelControllerScript);
	controllerScript.camera = camera1;
	var ob = 4 * Math.sqrt(2);
	camera1.position.set(ob, ob, ob);
	this.app.addObject(controller);
	
	this.controllerScript = controllerScript;
	
	this.scene = new Vizi.Object;
	this.app.addObject(this.scene);

	// Create a groupt o hold all the cubes
	var group = new Vizi.Object;
	
	// Add a rotate behavior to give the group some life
	var rotator = new Vizi.RotateBehavior({autoStart:false, duration:5});
	//group.addComponent(rotator);	
	
	this.scene.addChild(group);
	this.group = group;
}

// event/input handling
ColorCube.prototype.onMouseDown = function(event) {
	if (!this.currentColor)
		this.dragging = true;
}

ColorCube.prototype.onMouseUp = function(event) {
	this.dragging = false;
}

ColorCube.prototype.calcElementOffset = function(offset) {

	offset.left = this.domElement.offsetLeft;
	offset.top = this.domElement.offsetTop;
	
	var parent = this.domElement.offsetParent;
	while(parent) {
		offset.left += parent.offsetLeft;
		offset.top += parent.offsetTop;
		parent = parent.offsetParent;
	}
}

ColorCube.prototype.onMouseMove = function(event) {
	this.lastMouseEvent = event;
}

ColorCube.prototype.onKeyTap = function() {
	console.log("In ColorCube key tap");
	
	// hack city - need to make this more rational
	if (this.lastMouseEvent) {
		var event = this.lastMouseEvent;
		
		var offset = {};
		this.calcElementOffset(offset);
		
		var eltx = event.pageX - offset.left;
		var elty = event.pageY - offset.top;
		
		var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY, 
		    	elementX : eltx, elementY : elty, button:event.button };
		
	    Vizi.PickManager.handleMouseMove(evt);
		if (this.currentColor)
			holiday.setColor(this.currentColor);
	}
}

// color handling
ColorCube.prototype.onCubeMouseUp = function() {
	this.setColor();
}

ColorCube.prototype.onCubeMouseOut = function() {
	this.currentColor = null;
}

ColorCube.prototype.createCubeHandler = function(cube, color) {
	var that = this;
	return function(event) {
		that.handleColor(cube, color);
	}
}

ColorCube.prototype.handleColor = function(cube, color) {
	if (this.dragging)
		return;
	
	color = hexToRGB(color);
	this.currentColor = color;
	
	holiday.handleColor(color);
}

ColorCube.prototype.setColor = function() {
	var color = this.currentColor;
	if (color) {
//		console.log("setColor:" + color.r + "," + color.g + "," + color.b);	
	}
	
	holiday.setColor(color);
}

ColorCube.prototype.handleLeapRotationChanged = function(pitch, yaw, roll) {
	return;
	
    var str = "ColorCube.handleLeapRotationChanged:  " +
    " Pitch: " + pitch +
    " Yaw: " + yaw +
    " Roll: " + roll
    "";

    //console.log(str);

    var dp = pitch - this.lastLeapPitch;
    var dy = yaw - this.lastLeapYaw;
    var dr = roll - this.lastLeapRoll;

    if (Math.abs(dp) > Math.abs(dy))
    	dy = 0;
    else
    	dp = 0;
    
    if (dp > 0)
    	this.controllerScript.controls.rotateUp(Math.PI / 30);
    else if (dp < 0)
    	this.controllerScript.controls.rotateDown(Math.PI / 30);

    if (dr > 0)
    	this.controllerScript.controls.rotateLeft(Math.PI / 30);
    else if (dr < 0)
    	this.controllerScript.controls.rotateRight(Math.PI / 30);
    
	this.lastLeapPitch = pitch;
	this.lastLeapYaw = yaw;
	this.lastLeapRoll = roll;

}

ColorCube.prototype.handleLeapPositionChanged = function(x, y, z) {
	return;
	
    var str = "ColorCube.handleLeapPositionChanged:  " +
    " X: " + x +
    " Y: " + y +
    " Z: " + z
    "";

    //console.log(str);

    var dx = x - this.lastLeapX;
    var dy = y - this.lastLeapY;
    var dz = z - this.lastLeapZ;

    if (Math.abs(dx) > Math.abs(dz))
    	dz = 0;
    else
    	dx = 0;
    
    if (dz > 0)
    	this.controllerScript.controls.rotateUp(Math.PI / 60);
    else if (dz < 0)
    	this.controllerScript.controls.rotateDown(Math.PI / 60);

    if (dx > 0)
    	this.controllerScript.controls.rotateLeft(Math.PI / 60);
    else if (dx < 0)
    	this.controllerScript.controls.rotateRight(Math.PI / 60);
    
	this.lastLeapX = x;
	this.lastLeapY = y;
	this.lastLeapZ = z;

}

ColorCube.prototype.handleLeapSwipe = function(direction, speed) {
    
	var x = direction[0], y = direction[1];

	var absx = Math.abs(x);
	var absy = Math.abs(y);
	if  (absx > absy)
		y = 0;
	else
		x = 0;
	
	speed /= 500;
	if (speed < 0)
		speed = 1;
	if (speed > 2)
		speed = 2;
	
    if (x > 0)
    	this.controllerScript.controls.rotateLeft(Math.PI / 60 * speed);
    else if (x < 0)
    	this.controllerScript.controls.rotateRight(Math.PI / 60 * speed);

	
    if (y < 0)
    	this.controllerScript.controls.rotateUp(Math.PI / 60 * speed);
    else if (y > 0)
    	this.controllerScript.controls.rotateDown(Math.PI / 60 * speed);
    
}

ColorCube.USE_WIREFRAME_FOR_CUBE = true;
ColorCube.SCALE_CUBE_ON_ROLLOVER = true;

ColorCube.CUBE_DEFAULT_WIDTH = .333;
ColorCube.CUBE_DEFAULT_HEIGHT = .333;
ColorCube.CUBE_DEFAULT_DEPTH = .333;

ColorCube.prototype.createCubes = function() {
	
	var width = ColorCube.CUBE_DEFAULT_WIDTH;
	var height = ColorCube.CUBE_DEFAULT_HEIGHT;
	var depth = ColorCube.CUBE_DEFAULT_DEPTH;
	var image = null;
	
	var group = this.group;
	
	var i, j, k;
	var x = -2;
	var r = 0;
	for (i = 0; i < 9; i++) {
		var y = -2;
		var g = 0;
		for (j = 0; j < 9; j++) {
			var b = 0;
			var z = -2;
			for (k = 0; k < 9; k++) {
				r = 255 * i / 8;
				g = 255 * j / 8;
				b = 255 * k / 8;
				var color = r << 16 | (g << 8) | b;
				var cube = new Vizi.Object;	
				var visual = new Vizi.Visual(
						{ geometry: new THREE.CubeGeometry(width, height, depth),
							material: new THREE.MeshBasicMaterial({ color : color,
								map: image ? THREE.ImageUtils.loadTexture(image) :
								null})
						});
				cube.addComponent(visual);

				if (ColorCube.USE_WIREFRAME_FOR_CUBE) {
					/* wireframe outline */
					var wf = new Vizi.Object;	
					var visual = new Vizi.Visual(
							{ geometry: new THREE.CubeGeometry(width * 1.01, height * 1.01, depth * 1.01),
								material: new THREE.MeshBasicMaterial({ color : 0x888888,
									wireframe:true})
							});
					wf.addComponent(visual);
					cube.addChild(wf);
				}
				
				var that = this;
				var picker = new Vizi.Picker;
				picker.addEventListener("mouseover", this.createCubeHandler(cube, color));
				picker.addEventListener("mouseup", function(event) { that.onCubeMouseUp(); });
				picker.addEventListener("mouseout", function(event) { that.onCubeMouseOut(); } );
				picker.addEventListener("touchstart", this.createCubeHandler(cube, color));
				picker.addEventListener("touchend", function(event) { that.onCubeMouseUp(); });
				cube.addComponent(picker);
			
			    // Tilt the cube toward the viewer so we can see 3D-ness
			    cube.transform.position.set(x, y, z);
			    z += .5;
			    b += 32;
			    // Add the cube the group
				this.group.addChild(cube);
			}
		    y += .5;
		    g += 32;
		}
	    x += .5;
	    r += 32;
	}
}

ColorCube.prototype.run = function() {
	this.app.run();
}
