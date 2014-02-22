hexToRGB = function(color) {
	return {
		r : (color & 0xff0000) >> 16,
		g : (color & 0xff00) >> 8,
		b : color & 0xff,
	};
}

rgbToHex = function(color) {
	return color.r << 16 | color.g << 8 | color.b;
}

rgbToCSS = function(color) {
	var r = parseInt(color.r).toString(16);
	var g = parseInt(color.g).toString(16);
	var b = parseInt(color.b).toString(16);
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    
	return "#" + r + g + b;
}

