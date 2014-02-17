holiday = {
		
};

holiday.build = function(element) {
	holiday.app = new Vizi.Application({ container : element });
	
	holiday.initScene();
	holiday.createCubes();
	
	holiday.swatchElement = document.getElementById("swatch");
}

holiday.initScene = function() {

	var camobj = new Vizi.Object;
	camera1 = new Vizi.PerspectiveCamera({active:true});
	camobj.addComponent(camera1);
	camera1.position.z = 10;
	holiday.app.addObject(camobj);

	var controller = Vizi.Prefabs.ModelController({active:true, headlight:true});
	var controllerScript = controller.getComponent(Vizi.ModelControllerScript);
	controllerScript.camera = camera1;
	holiday.app.addObject(controller);
		
	holiday.scene = new Vizi.Object;
	holiday.app.addObject(this.scene);

	// Create a groupt o hold all the cubes
	var group = new Vizi.Object;
	
	// Add a rotate behavior to give the group some life
	var rotator = new Vizi.RotateBehavior({autoStart:false, duration:5});
	//group.addComponent(rotator);	
	
	holiday.scene.addChild(group);
	holiday.group = group;
}

holiday.Cube = {};
holiday.Cube.DEFAULT_WIDTH = .333;
holiday.Cube.DEFAULT_HEIGHT = .333;
holiday.Cube.DEFAULT_DEPTH = .333;

hexToRGB = function(color) {
	return {
		r : (color & 0xff0000) >> 16,
		g : (color & 0xff00) >> 8,
		b : color & 0xff,
	};
}

rgbToCSS = function(color) {
	var r = color.r.toString(16);
	var g = color.g.toString(16);
	var b = color.b.toString(16);
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    
	return "#" + r + g + b;
}

createCubeHandler = function(color) {
	color = hexToRGB(color);
	color = rgbToCSS(color);
	return function(event) {
		console.log ("Color: ", color);
		holiday.handleColor(color);
	}
}

holiday.handleColor = function(color) {
	holiday.swatchElement.style.backgroundColor = color;
}

holiday.createCubes = function() {
	
	var width = holiday.Cube.DEFAULT_WIDTH;
	var height = holiday.Cube.DEFAULT_HEIGHT;
	var depth = holiday.Cube.DEFAULT_DEPTH;
	var image = null;
	
	var group = holiday.group;
	
	var i, j, k;
	var x = -2;
	var r = 0;
	for (i = 0; i < 8; i++) {
		var y = -2;
		var g = 0;
		for (j = 0; j < 8; j++) {
			var b = 0;
			var z = -2;
			for (k = 0; k < 8; k++) {
				r = 255 * i / 7;
				g = 255 * j / 7;
				b = 255 * k / 7;
				var color = r << 16 | (g << 8) | b;
				var cube = new Vizi.Object;	
				var visual = new Vizi.Visual(
						{ geometry: new THREE.CubeGeometry(width, height, depth),
							material: new THREE.MeshPhongMaterial({ color : color,
								map: image ? THREE.ImageUtils.loadTexture(image) :
								null})
						});
				cube.addComponent(visual);
				
				var picker = new Vizi.Picker;
				picker.addEventListener("mouseover", createCubeHandler(color));
				cube.addComponent(picker);
			
			    // Tilt the cube toward the viewer so we can see 3D-ness
			    cube.transform.position.set(x, y, z);
			    z += .5;
			    b += 32;
			    // Add the cube the group
				holiday.group.addChild(cube);
			}
		    y += .5;
		    g += 32;
		}
	    x += .5;
	    r += 32;
	}
}

holiday.run = function() {
	holiday.app.run();
}
