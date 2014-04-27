function getBoundingBox(d3Text) {
	
}

function boxesIntersect(box1, box2) {

}

function placeGridInSquare(svg, squareElement, square) {
		word = square[1];
		squareX = squareElement.attr("x");
		squareY = squareElement.attr("y");
		squareWidth = squareElement.attr("width");
		squareHeight = squareElement.attr("height");
		letterCount = word.length;		
		
		// Hacky -- temporarily rendering a letter template to find it's rough fitting.
		svg
			.append("text")
			.text("M")
			.attr("font-size", fontSize + "px")
			.style("opacity", "0.0")
			.attr("id", "test")
		
		test = svg.select("#test")
		testBbox = test.node().getBBox()
		console.log(test);
		console.log(testBbox);
		test.remove();
	
		charHeight = testBbox.height;
		charWidth = testBbox.width;
		// TODO -- font+area based intelligence here.
		console.log("Fitting");
		console.log(squareWidth + " " + charWidth);
		console.log(squareHeight + " " + charHeight);
		colCount = parseInt(squareWidth/charWidth);
		rowCount = parseInt(letterCount/colCount) + (letterCount % colCount > 0 ? 1 : 0);
		padX = (squareWidth - colCount * charWidth) / 2;				
		console.log(padX);
		index = 0;
		for (j = 0; j < rowCount; j++) {
			// Place the words into the shape.
			for (k = 0; k < colCount; k++) {
				//console.log(rowCount + " " + colCount + " " + j + " " + k);
				//console.log(index);
				if (index < letterCount) {
					curChar = word.substring(index, index + 1);
					index++;
					console.log(curChar);
				
				letterId = "text" + square[0] + "-" + index;
				curWidth =  k * charWidth;
				curHeight = j * charHeight;
				xTry =  parseInt(squareX) + padX + curWidth;
				svg.append("text")
					.text(curChar)
					.attr("font-size", fontSize + "px")
					.attr("x", xTry)
					.attr("y", curHeight + 100)
					.attr("id", letterId);
				}
				// Fine centering.
				toCenter = d3.select("#" + letterId);
				curBox = toCenter.node().getBBox();
				curPad = charWidth - curBox.width;
				// toCenter.attr("x", curPad > 0 ? curPad/2 + curBox.x : curBox.x );
			}
		}
}


var textElement;
$(document).ready(function() {

	// Index, Name, Shape Color, Translation lists, Rotation lists, scaling lists
	squares = [[0, "CALIFORNIA", "red"],
		[1, "TEXAS", "green"],
		[2, "NEW YORK", "orange"], 
		[3, "WASHINGTON", "pink"]
	];
	
	var width = 330;//($(window).width()/squares.length) - 5,
		height = 330;

	var svg = d3.select("body").append("svg")
			.attr("width", width * squares.length)
			.attr("height", height)
			.attr("id", "container");
	
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
		.attr("id", function(d) { return "square" + d[0]})
		
	// TODO -- make this variable.
	// TODO -- have a test generation stage for char sizes.
	// TODO -- Group the letters together somehow.
	// TODO -- Make bottom centering better.
	// TODO -- More intelligent kerning.
	fontSize = 87;
	for (i = 0; i < squares.length; i++) {
		squareElement = $("#square"+i);
		placeGridInSquare(svg, squareElement, squares[i]);
	}	

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