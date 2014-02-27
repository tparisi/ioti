CodeShow = function(element) {

	this._domElement = element;	
	this._src = "";
	this._active = false;
	this._lineNumber = 0;
	this._lastUpdateTime = Date.now();
	
    Object.defineProperties(this, {
        src: {
	        get: function() {
	            return this._src;
	        },
	        set: function(v) {
	        	this._setSrc(v);
	        }
    	},    	
        lineNumber: {
	        get: function() {
	            return this._lineNumber;
	        },
	        set: function(v) {
	        	this._setLineNumber(v);
	        }
    	},    	

    });
}

CodeShow.prototype = new Object;

CodeShow.prototype.runLoop = function() {
	var that = this;
	requestAnimationFrame(function() {
		that.runLoop();
	});
	
	this.animate();
}

CodeShow.files = [
                  	"./colorCube.js",
                  	"./lightCircle.js",
                  	"../libs/vizi/vizi.js",
                  	"../libs/moorescloud/holiday.js",
                  	"../libs/leapjs/leap.js",
                  ];

CodeShow.prototype.run = function() {
	this.src = CodeShow.files[0];
	this.currentFileIndex = 0;
	this._startTime = Date.now();
	if (this._text && this._domElement) {
		this._domElement.text = this._text;
	}
	this.runLoop();
}

CodeShow.prototype.animate = function() {
	
	return;
	
	var now = Date.now();
	var deltat = now - this._lastUpdateTime;
	if (deltat >= CodeShow.ANIMATE_INTERVAL) {
//		console.log("CodeShow animating...");
		var elapsed = now - this._startTime;
		if (elapsed > 40000) {
		}
		else if (elapsed > 30000) {
			this.src = "./leapController.js";
			this.lineNumber = 0;
		}
		else if (elapsed > 20000) {
			this.src = "../libs/moorescloud/holiday.js";
			this.lineNumber = 0;
		}
		else if (elapsed > 10000) {
			this.src = "./lightCircle.js";
			this.lineNumber = 0;
		}
		
		{
			this._lineNumber = elapsed / 1000 * CodeShow.LINES_PER_SECOND;
			this._domElement.scrollTop = this._lineNumber * CodeShow.LINE_HEIGHT;
		}
		this._lastUpdateTime = now;
	}
}

CodeShow.prototype.next = function() {
	this.currentFileIndex++;
	if (this.currentFileIndex > CodeShow.files.length)
		this.currentFileIndex = 0;
	
	this.src = CodeShow.files[this.currentFileIndex];
}

CodeShow.prototype.previous = function() {
	--this.currentFileIndex;
	if (this.currentFileIndex < 0)
		this.currentFileIndex = CodeShow.files.length - 1;
	
	this.src = CodeShow.files[this.currentFileIndex];

}

CodeShow.prototype._setLineNumber = function(v) {
	this._lineNumber = v;
	if (this._domElement) {
		this._domElement.scrollTop = this._lineNumber * CodeShow.LINE_HEIGHT;
	}
}

CodeShow.prototype._setSrc = function(v) {
	
	if (this._src == v)
		return;
	
	this._src = v;

	var xhr = new XMLHttpRequest();
    var path = this._src;
    xhr.open('GET', path, true);

	var that = this;
    xhr.addEventListener( 'load', function ( event ) {
    	if (xhr.status < 400) {
    		that.handleSourceLoaded(path, xhr.responseText);
    	}
    	else {
        	that.handleFileError(path, xhr.status);
    	}
    }, false );
    xhr.addEventListener( 'error', function ( event ) {
    	that.handleFileError(path, xhr.status);
    }, false );
    xhr.send(null);
}


CodeShow.prototype.handleSourceLoaded = function(path, text) {
	this._text = text;
	if (this._domElement) {		
		this._domElement.innerHTML = "<pre>" + text + "</pre>";
		this._domElement.scrollTop = this._lineNumber * CodeShow.LINE_HEIGHT;
	}
}

CodeShow.prototype.handleFileError = function(path, status) {
	console.log("Error loading file ", path, " ; status: ", status)
}

// Constants
CodeShow.ANIMATE_INTERVAL = 60; //ms
CodeShow.LINE_HEIGHT = 12; //px
CodeShow.LINES_PER_SECOND = 1;



