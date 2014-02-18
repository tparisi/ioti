holiday = {
		
};

holiday.lightCircleRadius = 0;
holiday.currentLight = -1;

holiday.build = function(element, canvasDiv, canvasElement) {

	holiday.colorCubeElement = element;
	holiday.canvasDiv = canvasDiv;
	holiday.canvasElement = canvasElement;

	holiday.onWindowResize();

	holiday.rgbElement = document.getElementById("rgb");
	holiday.swatchElement = document.getElementById("swatch");
	holiday.lightElement = document.getElementById("light");

	document.addEventListener('mousedown', function(event) { holiday.lightCircle.onMouseDown(event); }, false );
	document.addEventListener('mouseup',  function(event) { holiday.lightCircle.onMouseUp(event); }, false );
	window.addEventListener( 'resize', function(event) { holiday.onWindowResize(event); }, false );

	holiday.colorCube = new ColorCube(element);
	holiday.lightCircle = new LightCircle(canvasElement, holiday.lightCircleRadius);
	holiday.setLight(0);
}

// color handling
holiday.currentColor = null;

holiday.handleColor = function(color) {
	holiday.currentColor = color;
	holiday.rgbElement.innerHTML = color.r + "," + color.g + "," + color.b;
}

holiday.setColor = function(color) {
	if (color) {
		color = rgbToCSS(color);
		holiday.swatchElement.style.backgroundColor = color;
		holiday.lightCircle.setColor(color);
	}
//	console.log("setColor:" + color.r + "," + color.g + "," + color.b);	
}

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
	

	dim += 120;
	holiday.canvasElement.width = dim;
	holiday.canvasElement.height = dim;
	holiday.canvasDiv.style.width = dim + "px";
	holiday.canvasDiv.style.height = dim + "px";
	holiday.canvasDiv.style.left = l - 60 + "px";
	holiday.canvasDiv.style.top = t - 60 + "px";
	
	holiday.lightCircleRadius = dim / 2 - 40;
	if (holiday.lightCircle) {
		holiday.lightCircle.setBorderRadius(holiday.lightCircleRadius);
	}
}

// app run loop(s)
holiday.run = function() {
	holiday.colorCube.run();
	holiday.lightCircle.run();
}
