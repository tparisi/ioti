LightTween = function(param) {
	param = param || {};
	
	this.from = param.from;
	this.to = param.to;
	this.target = param.target;
	this.duration = param.duration ? param.duration : LightTween.default_duration;
	this.loop = param.loop ? param.loop : false;
	this.easing = param.easing;
	this.running = false;
	
}

LightTween.prototype = new Object;

LightTween.prototype.start = function()
{
	if (this.running)
		return;
	
	this.startTime = Date.now();
	this.running = true;
	KF.add(this);
}

LightTween.prototype.stop = function()
{
	this.running = false;
	KF.remove(this);
}

// Update - drive key frame evaluation
LightTween.prototype.update = function()
{
	if (!this.running)
		return;
	
	var now = Date.now();
	var deltat = (now - this.startTime) % this.duration;
	var nCycles = Math.floor((now - this.startTime) / this.duration);
	var fract = deltat / this.duration;
	if (this.easing)
		fract = this.easing(fract);
	
	if (nCycles >= 1 && !this.loop)
	{
		this.running = false;
		this.interp(1);
		KF.remove(this);
		return;
	}
	else
	{
		this.interp(fract);
	}
}

//Interpolation and tweening methods
LightTween.prototype.interp = function(fract)
{
	var i, len = this.from.length, tolen = this.to.length, targetlen = this.target.length;
	len = Math.min(len, tolen);
	len = Math.min(len, targetlen);
	var hslfrom = { h: 0, s: 0, l: 0 };
	var hslto = { h: 0, s: 0, l: 0 };
	var hslout = { h: 0, s: 0, l: 0 };
	for (i = 0; i < len; i++) {
		var colorfrom = this.from[i];
		var colorto = this.to[i];
		/*
		hslfrom = colorfrom.getHSL(hslfrom);  // upgrade to new Vizi/THREE.js soon, will be able to do this in place
		hslto = colorto.getHSL(hslto);
		this.tween(hslfrom, hslto, hslout, fract);
		this.target[i].setHSL(hslout);
		*/
		var colorout = this.target[i];
		this.tween(colorfrom, colorto, colorout, fract);
	}
}

LightTween.prototype.tween = function(hslfrom, hslto, hslout, fract)
{
	for (prop in hslfrom) {
		switch (prop) {
			case "r" :
			case "g" :
			case "b" :
				var range = hslto[prop] - hslfrom[prop];
				var delta = range * fract;
				hslout[ prop ] = hslfrom[ prop ] + delta;
			break;
		}
		
	}
}

LightTween.createCycleTween = function(lights) {
	var len = lights.length;
	var from = new Array(len);
	var to = new Array(len);
	for (var i = 0; i < len; i++) {
		from[i] = lights[i].clone();
	}
	
	for (i = 0; i < len; i++) {
		to[i ] = new THREE.Color;
	}

//	to[0] = lights[len - 1].clone();
	
	return new LightTween({
		from : from,
		to : to,
		target : lights,
		loop : true,
		easing: TWEEN.Easing.Quadratic.InOut
	});
}

// Constants
LightTween.default_duration = 5000; //ms