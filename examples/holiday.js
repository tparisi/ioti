holiday = {
		
};

holiday.build = function(element, canvasElement) {
	holiday.colorCube = new ColorCube(element);

	holiday.lightCircle = new LightCircle(canvasElement);
	
	holiday.rgbElement = document.getElementById("rgb");
	holiday.swatchElement = document.getElementById("swatch");

	document.addEventListener('mousedown', function(event) { holiday.lightCircle.onMouseDown(event); }, false );
	document.addEventListener('mouseup',  function(event) { holiday.lightCircle.onMouseUp(event); }, false );

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

holiday.run = function() {
	holiday.colorCube.run();
	holiday.lightCircle.run();
}
