holiday = {
		
};

holiday.LIGHTCIRCLE_BORDER_RADIUS = 360;
holiday.currentLight = -1;

holiday.build = function(element, canvasDiv, canvasElement) {
	
	var w = element.offsetWidth;
	var h = element.offsetHeight;
	var dim = Math.min(w, h);
	element.style.width = dim + "px";
	element.style.height = dim + "px";
	element.style.left = (window.innerWidth - element.offsetWidth) / 2 + "px";
	element.style.top = (window.innerHeight - element.offsetHeight) / 2 + "px";
	var l = element.offsetLeft;
	var t = element.offsetTop;
	
	holiday.colorCube = new ColorCube(element);

	dim += 120;
	holiday.canvasDiv = canvasDiv;
	holiday.canvasElement = canvasElement;
	canvasElement.width = dim;
	canvasElement.height = dim;
	canvasDiv.style.width = dim + "px";
	canvasDiv.style.height = dim + "px";
	canvasDiv.style.left = l - 60 + "px";
	canvasDiv.style.top = t - 60 + "px";
	holiday.lightCircle = new LightCircle(canvasElement, dim / 2 - 40);
	
	holiday.rgbElement = document.getElementById("rgb");
	holiday.swatchElement = document.getElementById("swatch");
	holiday.lightElement = document.getElementById("light");

	document.addEventListener('mousedown', function(event) { holiday.lightCircle.onMouseDown(event); }, false );
	document.addEventListener('mouseup',  function(event) { holiday.lightCircle.onMouseUp(event); }, false );

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

holiday.run = function() {
	holiday.colorCube.run();
	holiday.lightCircle.run();
}
