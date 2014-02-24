holiday = {
		
};

holiday.currentDevice = 0;
holiday.lightCircleRadius = 0;
holiday.currentLight = -1;
holiday.NUM_LIGHTS = 50;

holiday.build = function(element, canvasDiv, canvasElement) {

	
	holiday.colorCubeElement = element;
	holiday.canvasDiv = canvasDiv;
	holiday.canvasElement = canvasElement;

	holiday.rgbElement = document.getElementById("rgb");
	holiday.swatchElement = document.getElementById("swatch");
	holiday.lightElement = document.getElementById("light");
	holiday.statusElement = document.getElementById("status");
	holiday.lightValuesElement = document.getElementById("lightValues");

	holiday.statusElement.innerHTML += "initializing layout...<br>";

	holiday.initLightValues();
	holiday.updateColors();
	
	document.addEventListener('mousedown', function(event) { holiday.lightCircle.onMouseDown(event); }, false );
	document.addEventListener('mouseup',  function(event) { holiday.lightCircle.onMouseUp(event); }, false );
	document.addEventListener( 'touchstart', function(event) { holiday.lightCircle.onTouchStart(event); }, false );
	document.addEventListener( 'touchend', function(event) { holiday.lightCircle.onTouchEnd(event); }, false );
	window.addEventListener( 'resize', function(event) { holiday.onWindowResize(event); }, false );

	// calculate canvas sizes based on page dimensions - do this early
	holiday.onWindowResize();
	
	holiday.statusElement.innerHTML += "initializing cube...<br>";
	holiday.colorCube = new ColorCube(element);
	holiday.statusElement.innerHTML += "initializing light controls...<br>";
	holiday.lightCircle = new LightCircle(canvasElement, holiday.lightCircleRadius);
	holiday.statusElement.innerHTML += "connecting to light...<br>";
	holiday.initDevices();
	holiday.statusElement.innerHTML += "initializing leap controller...<br>";
	holiday.leapController = new LeapController();
	holiday.leapController.rotationChangedCallback = holiday.onLeapRotationChanged;
	holiday.leapController.positionChangedCallback = holiday.onLeapPositionChanged;
	holiday.leapController.swipeCallback = holiday.onLeapSwipe;
	holiday.leapController.circleCallback = holiday.onLeapCircle;
	holiday.leapController.keyTapCallback = holiday.onLeapKeyTap;
	holiday.statusElement.innerHTML += "done.";
	holiday.setLight(0);
	holiday.statusElement.innerHTML = "";
}

holiday.initLightValues = function() {
	var values = new Array(holiday.NUM_LIGHTS);
	var i, len = values.length;
	for (i = 0; i < len; i++) {
		values[i] = new THREE.Color(0, 0, 0);
	}
	
	holiday.lightValues = values;
}

holiday.initDevices = function() {
	holiday.device = new Holiday('localhost:8080');
	holiday.deviceLights = holiday.device.fastbulbs;
	holiday.deviceNeedsUpdate = true;
	holiday.lastDeviceUpdateTime = Date.now();
}

// color handling
holiday.currentColor = null;

holiday.handleColor = function(color) {
	holiday.currentColor = color;
	holiday.rgbElement.innerHTML = color.r + "," + color.g + "," + color.b;
	color = rgbToCSS(color);
	holiday.swatchElement.style.backgroundColor = color;
}

holiday.setColor = function(color) {
	if (color) {
		if (holiday.currentLight != -1) {
			holiday.lightValues[holiday.currentLight].setRGB(color.r, color.g, color.b);
			holiday.updateColors();
		}
		color = rgbToCSS(color);
		holiday.swatchElement.style.backgroundColor = color;
		holiday.lightCircle.setColor(color);
		holiday.deviceNeedsUpdate = true;
	}
}

holiday.updateColors = function() {
	var elt = holiday.lightValuesElement;
	elt.innerHTML = "";
	
	var i, len = holiday.lightValues.length;
	for (i = 0; i < len; i++) {
		var color = holiday.lightValues[i];
		var istr = i.toString();
		istr += (istr.length == 1) ? ":  " : ": ";
		var colorval = color.r.toFixed(0) + "," + color.g.toFixed(0) + "," + color.b.toFixed(0) + "<br>";
		elt.innerHTML += (/*istr + */colorval);
	}
}

holiday.DEVICE_UPDATE_INTERVAL = 100; //ms
holiday.updateDevice = function() {

	var now = Date.now();
	if (now - holiday.lastDeviceUpdateTime < holiday.DEVICE_UPDATE_INTERVAL)
		return;
	
	var i, len = holiday.lightValues.length;
	for (i = 0; i < len; i++) {
		var color = holiday.lightValues[i];
		var hex = rgbToHex(color);
		holiday.deviceLights[i] = hex;
	}
	holiday.upload();
	holiday.deviceNeedsUpdate = false;
	holiday.lastDeviceUpdateTime = now;
}

holiday.setLights = function(lights) {
	var i, len = lights.length;
	for (i = 0; i < len; i++) {
		var light = lights[i];
		holiday.lightValues[i].setRGB(parseInt(light.r), parseInt(light.g), parseInt(light.b));
	}
	holiday.updateLights();
	holiday.updateColors();
}

holiday.updateLights = function() {
	holiday.updateColors();
	var i, len = holiday.lightValues.length;
	for (i = 0; i < len; i++) {
		var color = holiday.lightValues[i];
		var color = rgbToCSS(color);
		holiday.lightCircle.setLightColor(i, color);
	}
}

// light handling
holiday.setLight = function(lightIndex) {
	holiday.currentLight = lightIndex;
	if (holiday.currentLight != -1) {
		holiday.lightElement.innerHTML = holiday.currentLight;
	}
}


// event handling
holiday.onWindowResize = function(event) {
	
	holiday.colorCubeElement.style.left = "20%";
	holiday.colorCubeElement.style.top = "20%";
	holiday.colorCubeElement.style.width = "60%";
	holiday.colorCubeElement.style.height = "60%";
	
	var w = holiday.colorCubeElement.offsetWidth;
	var h = holiday.colorCubeElement.offsetHeight;
	var dim = Math.min(w, h);
	holiday.colorCubeElement.style.width = dim + "px";
	holiday.colorCubeElement.style.height = dim + "px";
	holiday.colorCubeElement.style.left = (window.innerWidth - holiday.colorCubeElement.offsetWidth) / 2 + "px";
	holiday.colorCubeElement.style.top = (window.innerHeight - holiday.colorCubeElement.offsetHeight) / 2 + "px";
	var l = holiday.colorCubeElement.offsetLeft;
	var t = holiday.colorCubeElement.offsetTop;
	

	dim += 160;
	holiday.canvasElement.width = dim;
	holiday.canvasElement.height = dim;
	holiday.canvasDiv.style.width = dim + "px";
	holiday.canvasDiv.style.height = dim + "px";
	holiday.canvasDiv.style.left = l - 80 + "px";
	holiday.canvasDiv.style.top = t - 80 + "px";
	
	holiday.lightCircleRadius = dim / 2 - 40;
	if (holiday.lightCircle) {
		holiday.lightCircle.setBorderRadius(holiday.lightCircleRadius);
	}
}

holiday.onLeapRotationChanged = function(pitch, yaw, roll) {
    holiday.colorCube.handleLeapRotationChanged(pitch, yaw, roll);
}

holiday.onLeapPositionChanged = function(x, y, z) {
    holiday.colorCube.handleLeapPositionChanged(x, y, z);
}

holiday.onLeapSwipe = function(direction, speed) {
    holiday.colorCube.handleLeapSwipe(direction, speed);
}

holiday.onLeapCircle = function(center, normal) {
	holiday.colorCube.onKeyTap();
	
	return;
	holiday.circleFill();
}

holiday.onLeapKeyTap = function(position) {
	holiday.colorCube.onKeyTap();
}

// app run loop(s)
holiday.runLoop = function() {
	requestAnimationFrame(holiday.runLoop);
	
	// update any animations
	if (holiday.animations) {
		holiday.animations.update();
	
		if (holiday.lightTween && holiday.lightTween.running) {
			holiday.updateLights();
			holiday.deviceNeedsUpdate = true;
		}
	}
	
	// update any animations
	if (holiday.programs) {
		holiday.programs.update();
	
		if (holiday.lightProgram && holiday.lightProgram.running) {
			holiday.updateLights();
			holiday.deviceNeedsUpdate = true;
		}			
	}
	
	if (holiday.device && holiday.deviceNeedsUpdate) {		
		holiday.updateDevice();
	}
}

holiday.run = function() {
	holiday.colorCube.run();
	holiday.lightCircle.run();
	holiday.leapController.run();
	
	holiday.runLoop();
}

holiday.playAnimation = function() {
	if (!holiday.animations) {
		holiday.animations = KF;
	}
	holiday.lightTween = LightTween.createCycleTween(holiday.lightValues);
	holiday.lightTween.start();
}

holiday.stopAnimation = function() {
	if (!holiday.lightTween)
		return;
	
	holiday.lightTween.stop();
	holiday.lightTween = null;
}

holiday.runProgram = function() {
	if (!holiday.programs) {
		holiday.programs = LightPrograms;
	}
	holiday.lightProgram = new LightPrograms.Cycle(holiday.lightValues);
	holiday.lightProgram.run();
}

holiday.stopProgram = function() {
	if (!holiday.lightProgram)
		return;
	
	holiday.lightProgram.stop();
	holiday.lightProgram = null;
}

holiday.circleFill = function() {

	if (holiday.currentLight == -1)
		holiday.currentLight = 0;
	
	var color = holiday.lightValues[holiday.currentLight];
	color = { r : color.r, g : color.g, b : color.b };
	var csscolor = rgbToCSS(color);

	for (var i = 0; i <= holiday.NUM_LIGHTS; i++) {
		holiday.lightValues[holiday.currentLight].setRGB(color.r, color.g, color.b);
		holiday.lightCircle.setLightColor(holiday.currentLight, csscolor);
		holiday.currentLight++;
		if (holiday.currentLight >= holiday.NUM_LIGHTS)
			holiday.currentLight = 0;
	}

	holiday.deviceNeedsUpdate = true;
}

// file serialization and device upload
holiday.DATA_FILE = '../data/holiday%d.json';
holiday.PHP_FILE = 'holiday.php';
holiday.PHP_SAVE_ACTION = 'action=save';
holiday.PHP_UPLOAD_ACTION = 'action=upload';
holiday.PHP_DEVICE_ARG = 'device=';
holiday.PHP_TIMESTAMP_ARG = 'time=';

holiday.load = function() {
    var xhr = new XMLHttpRequest();
    var path = holiday.DATA_FILE.replace(/%d/, holiday.currentDevice);
    path+= ("?time=" + Date.now());
    xhr.open('GET', path, true);

    xhr.addEventListener( 'load', function ( event ) {
    	if (xhr.status < 400) {
    		holiday.onFileLoaded(path, xhr.responseText);
    	}
    	else {
        	holiday.onFileError(xhr.status);
    	}
    }, false );
    xhr.addEventListener( 'error', function ( event ) {
    	holiday.onFileError(xhr.status);
    }, false );
    xhr.send(null);
}

holiday.onFileLoaded = function(path, text) {
	// alert("File loaded: " + text);
	var data = JSON.parse(text);
	for (propS in data) {
		var setup = data[propS];
		for (propF in setup) {
			var frame = setup[propF];
			holiday.setLights(frame);
			holiday.lightCircle.setLight(0);
			holiday.deviceNeedsUpdate = true;
		}
	}
}

holiday.onFileError = function(status) {
	alert("File error: " + status);
}

holiday.lightsToJSON = function() {
	var lights = [];
	for (i = 0; i < holiday.NUM_LIGHTS; i++) {
		var color = holiday.lightValues[i];
		lights.push({ r : color.r, g : color.g, b : color.b });
	}
	
	return lights;
}

holiday.save = function() {
	var data = {
		"_h_0" : {
			"_f_0" : holiday.lightsToJSON()
		}
	};
	
	var url = holiday.PHP_FILE + "?" + holiday.PHP_SAVE_ACTION;
	var device = holiday.PHP_DEVICE_ARG + holiday.currentDevice;
	var timestamp = holiday.PHP_TIMESTAMP_ARG + Date.now();
	url = [url, device, timestamp].join("&");
	var saveData = $.ajax({
	      type: 'POST',
	      url: url,
	      data: data,
	      dataType: "text",
	      success: function(result) { console.log(result); /*console.log(JSON.parse(result));*/ },
	      error: function(err) { console.log(err); alert("Save error: " + err.status); }
	});	
}

holiday.upload = function() {
	
	var data = { lights : holiday.device.fast2json() };
	// data.lights = '{ "lights": [ "#ff7f5f", "#ff5f5f", "#ff5f5f", "#ff5f5f", "#ff5f5f", "#ff5f5f", "#ff5f5f", "#ff5f5f", "#ff5f5f", "#ff5f5f", "#ff5f5f", "#ff5f5f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#ff3f1f", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf", "#dfffbf" ] }';
	var timestamp = holiday.PHP_TIMESTAMP_ARG + Date.now();
	var url = holiday.PHP_FILE + "?" + holiday.PHP_UPLOAD_ACTION + "&" + timestamp;
	var saveData = $.ajax({
	      type: 'POST',
	      url: url,
	      data: data,
	      dataType: "text",
	      success: function(result) { console.log(result); /*console.log(JSON.parse(result));*/ },
	      error: function(err) { console.log(err); alert("Upload error: " + err.status); }
	});	
}

holiday.clear = function() {
	
	var i;
	for (i = 0; i < holiday.NUM_LIGHTS; i++) {
		holiday.lightValues[i].setRGB(0, 0, 0);
	}
	
	holiday.updateLights();
	holiday.deviceNeedsUpdate = true;
}

