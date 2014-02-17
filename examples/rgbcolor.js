hexToRGB = function(color) {
	return {
		r : (color & 0xff0000) >> 16,
		g : (color & 0xff00) >> 8,
		b : color & 0xff,
	};
}

rgbToCSS = function(color) {
	var r = color.r.toString(16);
	var g = color.g.toString(16);
	var b = color.b.toString(16);
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    
	return "#" + r + g + b;
}

