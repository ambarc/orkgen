$(document).ready(function() {

	// Index, Name, Shape Color, Translation lists, Rotation lists, scaling lists
	squares = [
		[0, "CALIFORNIA","red"],
		[1, "TEXAS", "green"],
		[2, "NEW YORK", "orange"], 
		[3, "WASHINGTON", "pink"]
	];

	
		var width = ($(window).width()/squares.length) - 5,
			height = 330;
	
	var svg = d3.select("body").append("svg")
			.attr("width", width * squares.length)
			.attr("height", height);
	
		svg.selectAll("rect")
			.data(squares)
			.enter()
			.insert("rect")
			.attr("class", "square intersects")
			.attr("width", width)
			.attr("height", height)
			.attr("x", function(d) { index = d[0]; return index * width; })
			.attr("y", 0)
			.attr("fill", function(d) { return d[2];})
			.attr("id", function(d) { return d[1]; })
				
				
		svg.selectAll("text")
			.data(squares)
			.enter()
			.insert("text")
			.text(function(d) {return d[1]})
			.attr("fill", "white")
			.attr("transform", function(d) {
				x = (d[0] * width);//+ width/2;
				y = width/2;
				return "translate(" + x + "," + y + ")";
			})
			.attr("font-size", "70px")			
			
		
			
		
	/*

	var square = svg.append("rect")
			.attr("class", "square intersects")
			.datum(width)
			.call(positionSquare)
			.attr("width", width)
			.attr("height", height)
			*/
			
			/*

	var polygon = svg.append("g")
			.attr("class", "polygon")
			.datum([[500, 300], [600, 300], [600, 400], [500, 400]]);

	polygon.append("path")
			.call(positionPath);

	polygon.selectAll("circle")
			.data(function(d) { return d; })
		.enter().append("circle")
			.call(positionCircle)
			.attr("r", 4.5)
			.call(d3.behavior.drag()
				.origin(function(d) { return {x: d[0], y: d[1]}; })
				.on("drag", function(d) {
					d[0] = d3.event.x, d[1] = d3.event.y;
					d3.select(this).call(positionCircle);
					polygon.select("path").call(positionPath);
					circle.classed("intersects", intersects(circle.datum(), polygon.datum()));
				}));

	function positionSquare(rect) {
		rect
				.attr("width", function(d) { return d[0]; })
				.attr("height", function(d) { return d[1]; });
	}
	*/

	function positionPath(path) {
		path
				.attr("d", function(d) { return "M" + d.join("L") + "Z"; });
	}

	function intersects(circle, polygon) {
		return pointInPolygon(circle, polygon)
				|| polygonEdges(polygon).some(function(line) { return pointLineSegmentDistance(circle, line) < circle[2]; });
	}

	function polygonEdges(polygon) {
		return polygon.map(function(p, i) {
			return i ? [polygon[i - 1], p] : [polygon[polygon.length - 1], p];
		});
	}

	function pointInPolygon(point, polygon) {
		for (var n = polygon.length, i = 0, j = n - 1, x = point[0], y = point[1], inside = false; i < n; j = i++) {
			var xi = polygon[i][0], yi = polygon[i][1],
					xj = polygon[j][0], yj = polygon[j][1];
			if ((yi > y ^ yj > y) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
		}
		return inside;
	}

	function pointLineSegmentDistance(point, line) {
		var v = line[0], w = line[1], d, t;
		return Math.sqrt(pointPointSquaredDistance(point, (d = pointPointSquaredDistance(v, w))
				? ((t = ((point[0] - v[0]) * (w[0] - v[0]) + (point[1] - v[1]) * (w[1] - v[1])) / d) < 0 ? v
				: t > 1 ? w
				: [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])])
				: v));
	}

	function pointPointSquaredDistance(v, w) {
		var dx = v[0] - w[0], dy = v[1] - w[1];
		return dx * dx + dy * dy;
	}

});