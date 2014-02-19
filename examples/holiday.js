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
	holiday.statusElement.innerHTML += "initializing leap controller...<br>";
	holiday.leapController = new LeapController();
	holiday.leapController.rotationChangedCallback = holiday.onLeapRotationChanged;
	holiday.leapController.positionChangedCallback = holiday.onLeapPositionChanged;
	holiday.statusElement.innerHTML += "done.";
	holiday.setLight(0);
	holiday.statusElement.innerHTML = "";
}

holiday.initLightValues = function() {
	var values = new Array(holiday.NUM_LIGHTS);
	var i, len = values.length;
	for (i = 0; i < len; i++) {
		values[i] = { r: 0, g: 0, b: 0};
	}
	
	holiday.lightValues = values;
}

// color handling
holiday.currentColor = null;

holiday.handleColor = function(color) {
	holiday.currentColor = color;
	holiday.rgbElement.innerHTML = color.r + "," + color.g + "," + color.b;
}

holiday.setColor = function(color) {
	if (color) {
		if (holiday.currentLight != -1) {
			holiday.lightValues[holiday.currentLight] = color;
			holiday.updateColors();
		}
		color = rgbToCSS(color);
		holiday.swatchElement.style.backgroundColor = color;
		holiday.lightCircle.setColor(color);
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
		var colorval = color.r + "," + color.g + "," + color.b + "<br>";
		elt.innerHTML += (istr + colorval);
	}
}

holiday.setLights = function(lights) {
	holiday.lightValues = lights;
	holiday.updateColors();
	var i, len = holiday.lightValues.length;
	for (i = 0; i < len; i++) {
		var color = holiday.lightValues[i];
		var color = rgbToCSS(color);
		if (i == 0)
			holiday.swatchElement.style.backgroundColor = color;
		holiday.lightCircle.setLightColor(i, color);
	}
	
	holiday.lightCircle.setLight(0);
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

// app run loop(s)
holiday.run = function() {
	holiday.colorCube.run();
	holiday.lightCircle.run();
	holiday.leapController.run();
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
		}
	}
}

holiday.onFileError = function(status) {
	alert("File error: " + status);
}

holiday.save = function() {
	var data = {
		"_h_0" : {
			"_f_0" : holiday.lightValues
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
	var data = {
			"_h_0" : {
				"_f_0" : holiday.lightValues
			}
		};
		
		var timestamp = holiday.PHP_TIMESTAMP_ARG + Date.now();
		var url = holiday.PHP_FILE + "?" + holiday.PHP_UPLOAD_ACTION + "&" + timestamp;
		var saveData = $.ajax({
		      type: 'POST',
		      url: url,
		      data: data,
		      dataType: "text",
		      success: function(result) { console.log(result); /*console.log(JSON.parse(result));*/ },
		      error: function(err) { console.log(err); alert("Save error: " + err.status); }
		});	
}

holiday.clear = function() {
	var lights = [];
	var i;
	for (i = 0; i < holiday.NUM_LIGHTS; i++) {
		lights.push({ r: 0, g: 0, b: 0});
	}
	
	holiday.setLights(lights);
}

