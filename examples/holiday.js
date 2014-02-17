holiday = {
		
};

holiday.build = function(element, canvasElement) {
	holiday.colorCube = new ColorCube(element);
	canvasElement.addEventListener('mousedown', holiday.onCanvasMouseDown, false );
	canvasElement.addEventListener('mouseup', holiday.onCanvasMouseUp, false );
	
	holiday.rgbElement = document.getElementById("rgb");
	holiday.swatchElement = document.getElementById("swatch");
}

holiday.onCanvasMouseDown = function(event) {
}

holiday.onCanvasMouseUp = function(event) {
	alert("got Canvas mouse up");
}

// color handling
holiday.currentColor = null;

holiday.handleColor = function(color) {
	holiday.currentColor = color;
	holiday.rgbElement.innerHTML = color.r + "," + color.g + "," + color.b;
}

holiday.setColor = function(color) {
	color = rgbToCSS(color);
	holiday.swatchElement.style.backgroundColor = color;
//	console.log("setColor:" + color.r + "," + color.g + "," + color.b);	
}

holiday.run = function() {
	holiday.colorCube.run();
}
