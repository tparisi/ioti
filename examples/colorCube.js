ColorCube = function(element) {
	this.app = new Vizi.Application({ container : element });
	var that = this;
	element.addEventListener('mousedown', function(event) { that.onMouseDown(event); }, false );
	element.addEventListener('mouseup', function(event) { that.onMouseUp(event); }, false );
	
	this.initScene();
	this.createCubes();	
	
	this.dragging = false;
	this.currentColor = null;
	this.currentColorCube = null;
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

// color handling
ColorCube.prototype.onCubeMouseUp = function() {
	this.setColor();
	this.currentColor = null;
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
/*

	cube.transform.scale.set(1.2, 1.2, 1.2);
	if (this.currentColorCube)
		this.currentColorCube.transform.scale.set(1, 1, 1);
*/
	
	this.currentColorCube = cube;
	
	holiday.handleColor(color);
}

ColorCube.prototype.setColor = function() {
	var color = this.currentColor;
	if (color) {
//		console.log("setColor:" + color.r + "," + color.g + "," + color.b);	
	}
	
	holiday.setColor(color);
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
