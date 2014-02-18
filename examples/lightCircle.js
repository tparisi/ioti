LightCircle = function(element, borderRadius) {
	
	this.dragging = false;
	this.currentLight = 0;
	this.currentColor = null;
	this.currentColorCube = null;
	
	this.canvas = element;
	this.context = this.canvas.getContext("2d");
	
	var that = this;

	this.borderRadius = borderRadius ? borderRadius : LightCircle.DEFAULT_BORDER_RADIUS;
	this.initControls();
}

LightCircle.prototype = new Object;

LightCircle.DEFAULT_BORDER_RADIUS = 360;
LightCircle.BORDER_COLOR = '#dddddd';
LightCircle.BORDER_COLOR_HIGHLIGHT = '#888888';
LightCircle.LIGHT_RADIUS = 8;
LightCircle.LIGHT_BORDER_RADIUS = 10;
LightCircle.NUM_LIGHTS = 50;
LightCircle.AUTO_ADVANCE = true;

LightCircle.prototype.initControls = function() {

	var w = this.canvas.width;
	var h = this.canvas.height;
	var i, positions = [], textPositions = [], lightColors = [];
	for (i = 0; i < LightCircle.NUM_LIGHTS; i++) {
		var theta = Math.PI * 2 * i / LightCircle.NUM_LIGHTS;
		var costheta = Math.cos(theta);
		var sintheta = Math.sin(theta);
		var xTextOffset = costheta > 0 ? 24 : 36;
		var yTextOffset = 24;
		positions.push( {
			x : w / 2 + this.borderRadius * costheta,
			y : w / 2 - this.borderRadius * sintheta
		});
		textPositions.push( {
			x : w / 2 + (this.borderRadius + xTextOffset) * costheta,
			y : w / 2 - (this.borderRadius + yTextOffset) * sintheta
		});
		lightColors.push('black');
	}
	
	this.lightPositions = positions;
	this.textPositions = textPositions;
	this.lightColors = lightColors;
}

LightCircle.prototype.runLoop = function() {
	var that = this;
	requestAnimationFrame(function() {
		that.runLoop();
	});
	
	this.draw();
}

LightCircle.prototype.draw = function() {
	this.drawBorder();
	this.drawLights();
}

LightCircle.prototype.drawBorder = function() {
	var w = this.canvas.width;
	var h = this.canvas.height;
	this.context.clearRect(0, 0, w, h);
    this.context.strokeStyle = LightCircle.BORDER_COLOR;
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.arc(w/2, h/2, this.borderRadius, 0, 2 * Math.PI, false);
    this.context.stroke();
}

LightCircle.prototype.drawLights = function() {
	this.context.fillStyle = 'black';
	this.context.strokeStyle = LightCircle.BORDER_COLOR;
	var i, len = this.lightPositions.length;
	for (i = 0; i < len; i++) {
		var pos = this.lightPositions[i];
		var textPos = this.textPositions[i];
	    var lightRadius = LightCircle.LIGHT_RADIUS;
	    var lightBorderRadius = LightCircle.LIGHT_BORDER_RADIUS;
    	this.context.fillStyle = this.lightColors[i];
	    if (i == this.currentLight) {
	    	lightRadius += 2;
	    	lightBorderRadius += 4;
	    	this.context.save();
	    	this.context.strokeStyle = LightCircle.BORDER_COLOR_HIGHLIGHT;
	    }
	    this.context.beginPath();
	    this.context.arc(pos.x, pos.y, lightRadius, 0, 2 * Math.PI, false);
	    this.context.fill();
	    this.context.beginPath();
	    this.context.arc(pos.x, pos.y, lightBorderRadius, 0, 2 * Math.PI, false);
	    this.context.stroke();
		this.context.fillStyle = 'black';
		this.context.fillText(i, textPos.x, textPos.y);
	    if (i == this.currentLight) {
	    	this.context.restore();
	    }
	}
}

LightCircle.prototype.setColor = function(color) {
	if (this.currentLight != -1) {
		this.lightColors[this.currentLight] = color;
		if (LightCircle.AUTO_ADVANCE)
			this.nextLight();
	}
}

LightCircle.prototype.setBorderRadius = function(borderRadius) {
	this.borderRadius = borderRadius;
	this.initControls();
}

LightCircle.prototype.setLight = function(index) {
	this.currentLight = index;
	holiday.setLight(index);
}

LightCircle.prototype.nextLight = function() {
	var index = ++this.currentLight;
	if (index >= LightCircle.NUM_LIGHTS)
		index = 0;
	this.setLight(index);
}

LightCircle.prototype.run = function() {
	this.runLoop();
}

// event handlers
LightCircle.prototype.calcDistance = function( p1, p2 ) {
	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;
	return Math.sqrt(dx * dx + dy * dy);
}

LightCircle.prototype.calcElementOffset = function(offset) {

	offset.left = this.canvas.offsetLeft;
	offset.top = this.canvas.offsetTop;
	
	var parent = this.canvas.offsetParent;
	while(parent) {
		offset.left += parent.offsetLeft;
		offset.top += parent.offsetTop;
		parent = parent.offsetParent;
	}
}


LightCircle.prototype.onMouseDown = function(event) {
	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;

	var p = { x : eltx, y : elty };

	var foundIndex = -1;
	var i, len = this.lightPositions.length;
	for (i = 0; i < len; i++) {
		var pos = this.lightPositions[i];
		var dist = this.calcDistance(p, pos);
		if (dist < LightCircle.LIGHT_BORDER_RADIUS) {
			foundIndex = i;
		}
	}
	
	if (foundIndex != -1) {
		this.setLight(foundIndex);
	}
}

LightCircle.prototype.onMouseUp = function(event) {

	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;

	var p = { x : eltx, y : elty };
	
}

LightCircle.prototype.onTouchStart = function( event ) {
	if ( event.touches.length > 1 ) {
	}
	else {
		// synthesize a left mouse button event
		var mouseEvent = {
			'type': 'mousedown',
		    'view': event.view,
		    'bubbles': event.bubbles,
		    'cancelable': event.cancelable,
		    'detail': event.detail,
		    'screenX': event.touches[0].screenX,
		    'screenY': event.touches[0].screenY,
		    'clientX': event.touches[0].clientX,
		    'clientY': event.touches[0].clientY,
		    'pageX': event.touches[0].pageX,
		    'pageY': event.touches[0].pageY,
		    'button': 0,
		    'preventDefault' : function() {}
			};
		
		this.onMouseDown(mouseEvent);
	}
}

LightCircle.prototype.onTouchEnd = function( event ) {
	if ( event.changedTouches.length > 1 ) {
		// nothing to do
	}
	else {
		// synthesize a left mouse button event
		var mouseEvent = {
			'type': 'mouseup',
		    'view': event.view,
		    'bubbles': event.bubbles,
		    'cancelable': event.cancelable,
		    'detail': event.detail,
		    'screenX': event.changedTouches[0].screenX,
		    'screenY': event.changedTouches[0].screenY,
		    'clientX': event.changedTouches[0].clientX,
		    'clientY': event.changedTouches[0].clientY,
		    'pageX': event.changedTouches[0].pageX,
		    'pageY': event.changedTouches[0].pageY,
		    'button': 0,
		    'preventDefault' : function() {}
		};
		
		this.onMouseUp(mouseEvent);
	}
}


