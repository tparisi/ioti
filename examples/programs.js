var LightPrograms = LightPrograms || ( function () {

	var programs = [];

	return	{
		add : function(animator)
		{
			programs.push(animator);
		},

		remove: function(animator)
		{

			var i = programs.indexOf(animator);

			if ( i !== -1 ) {
				programs.splice( i, 1 );
			}
		},

		update : function()
		{
			for (i = 0; i < programs.length; i++)
			{
				programs[i].update();
			}
		},
	};
})();

//Construction/initialization
LightPrograms.Program = function() 
{
	this.running = false;
}

LightPrograms.Program.prototype = new Object;

// Start/stop
LightPrograms.Program.prototype.run = function()
{
	if (this.running)
		return;
	
	this.startTime = Date.now();
	this.running = true;
	LightPrograms.add(this);
}

LightPrograms.Program.prototype.stop = function()
{
	this.running = false;
	LightPrograms.remove(this);
}

// Update - drive key frame evaluation
LightPrograms.Program.prototype.update = function()
{
	throw new Error("LightPrograms.Program.prototype.update: pure virtual function");
}

// Programs
// Cycle - rotate the lights
LightPrograms.Cycle = function(lights, interval) {
	this.lights = lights;
	this.interval = (interval === undefined) ? LightPrograms.Cycle.interval : interval;
}

LightPrograms.Cycle.prototype = new LightPrograms.Program;

LightPrograms.Cycle.prototype.run = function() {
	LightPrograms.Program.prototype.run.call(this);
	this.lastCycleTime = this.startTime;
}

LightPrograms.Cycle.prototype.update = function() {
	if (!this.running)
		return;
	
	var now = Date.now();
	var deltat = now - this.lastCycleTime;
	if (deltat > this.interval) {
		this.cycle();
		this.lastCycleTime = now;
	}
}

LightPrograms.Cycle.prototype.cycle = function() {
	var i, len = this.lights.length;

	if (len < 2)
		return;
	
	var tmp = this.lights[len - 1];
	for (i = 0; i < len - 1; i++) {
		var tmp = this.lights[i + 1];
		this.lights[i + 1] = this.lights[i];
		this.lights[i] = tmp;
	}
}

LightPrograms.Cycle.interval = 200; // ms
