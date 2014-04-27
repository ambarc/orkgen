

function getBoundingBox(d3Text) {
	
}

function boxesIntersect(box1, box2) {

}

function getFontSizeForAreaAndWord(area, word) {
	// Strip whitespace and get length of that
	var totalCharacters = word.replace(/ /g,'').length;
	var areaPerCharacter = area / totalCharacters;
	var squareWidth = Math.sqrt(areaPerCharacter);
	var squareWidthRounded = Math.ceil(squareWidth);

	// Create SVG to insert dummy text
	// Since we know size of square, we don't actually need to insert it in DOM
	var svgContainer = d3.select("body")
		.append("svg")
		.attr(squareWidthRounded+1)
		.attr(squareWidthRounded+1)
		.attr("id","dummycontainer-tushar");
	var txt = svgContainer.append("text")
		.attr("font-size", 300) // hard coded to 300 as starting...
		.attr("x",1)
		.attr("y",1)
		.attr("id","dummytext-tushar")
		.text("M");
	
	// Get it back now, since it has definite properties set above...
	var myChar = document.getElementById("dummytext-tushar");
	for(var fontsize = 300; fontsize > 0; fontsize--) {
		//console.log(myChar.getComputedTextLength()); //for debug only
		if(myChar.getComputedTextLength() < squareWidthRounded) {
			break;
		}
		myChar.setAttributeNS(null, "font-size", fontsize);
	}

	// Get rid of hackish crap still in the DOM
	var goAway = d3.select("#dummytext-tushar");
	goAway.remove();
	goAway = d3.select("#dummycontainer-tushar");
	goAway.remove();
	//alert("Font size: " + fontsize);
	return fontsize;
}

function getHackBbox(svg, fontsize, letter) {
		// Hacky -- temporarily rendering a letter template to find it's rough fitting.
		id = "test" + Math.floor((Math.random()*10000)+1);
		//console.log(id);
		svg
			.append("text")
			.text(letter)
			.attr("font-size", fontsize + "px")
			.attr("x", Math.floor((Math.random()*200)+1))
			.attr("y", Math.floor((Math.random()*200)+1))
			.style("opacity", "1.0")
			.attr("id", id)
		
		test = svg.select("#" + id)
		testBbox = test.node().getBBox();
		test.remove();
		return testBbox;
}

// TODO -- space available to fontsize conversion.
// Potentially thresholded greedy space eaters.
function maxCoverageInSquare(svg, squareElement, square) {
	// Get basic building block -- total area divided by letter size.
	// Aim for maximum coverage.
	squareWidth = squareElement.attr("width")
	squareHeight = squareElement.attr("height")

	squareArea = parseInt(squareWidth) * parseInt(squareHeight)
	word = square[1];
	letterCount = word.length;
	blockArea = parseInt(squareArea/letterCount);
	// TODO Get the font associated for a letter to occupy this much area.
	// Hack -- using 'M' as default.
	// Coding this in for now -- will generate from blockSize
	fontSize = square[3];
	console.log("Letter Count is " + letterCount);
	console.log("Square Width and height are : " + squareWidth + ", " + squareHeight)
	console.log("Total Available Area is " + squareArea)
	console.log("Single block Area is " + blockArea)
	console.log("Block Cumulative Area is " + blockArea * letterCount)
	
	// Finding the max average fontSize
	testFontSize = 50
	testBbox = getHackBbox(svg, testFontSize, "M")
	p = 0;
	// Area
	while(testBbox.width * testBbox.height < blockArea) {
		testFontSize = testFontSize + 2;
		testBbox = getHackBbox(svg, testFontSize, "M")
		console.log(testBbox.width * testBbox.height + "/" + blockArea);
		p++;
		if (p > 50) {
			break;
		}
	}
	console.log("got test font size as " + testFontSize)
	//square[3] = testFontSize;
	//placeGridInSquare(svg, squareElement, square);
	
	squareX = parseInt(squareElement.attr("x"));
	squareY = parseInt(squareElement.attr("y"));
	squareWidth = parseInt(squareElement.attr("width"));
	squareHeight = parseInt(squareElement.attr("height"));
	charHeight = testBbox.height;
	charWidth = testBbox.width;

	// console.log("Fitting");
	//console.log(squareWidth + " " + charWidth);
	//console.log(squareHeight + " " + charHeight);
	colCount = parseInt(squareWidth/charWidth);
	rowCount = parseInt(letterCount/colCount) + (letterCount % colCount > 0 ? 1 : 0);
	padX = 0;//(squareWidth - colCount * charWidth) / 4;				
	//console.log(padX);
	index = 0;
	xProgress = squareX;
	yProgress = charHeight/1.5;
	endX = squareX + squareWidth;
	for (j = 0; j < letterCount; j++) {
			curChar = word.substring(j, j + 1);
			console.log(curChar);
			letterId = "text" + square[0] + "-" + index;
			//curHeight = j * charHeight;
			//xTry =  parseInt(squareX) + padX + curWidth;
			svg.append("text")
				.text(curChar)
				.attr("font-size", testFontSize + "px")
				.attr("x", xProgress	)
				// Why the extra shit on y
				.attr("y", yProgress )
				.attr("id", letterId);
			
			xProgress = xProgress + getHackBbox(svg, testFontSize, curChar).width;
			if (xProgress + charWidth > endX) {
					xProgress = squareX;
					yProgress = yProgress + getHackBbox(svg, testFontSize, curChar).height;
			}
		
		console.log(xProgress + " " + yProgress + " " + charWidth + " " + charHeight);
		// Fine centering.
		// toCenter = d3.select("#" + letterId);
// 			curBox = toCenter.node().getBBox();
// 			curPad = charWidth - curBox.width;
// 			toCenter.attr("x", curPad > 0 ? curPad/2 + curBox.x : curBox.x );
	}
}

function placeGridInSquare(svg, squareElement, square) {
		word = square[1];
		squareX = squareElement.attr("x");
		squareY = squareElement.attr("y");
		squareWidth = squareElement.attr("width");
		squareHeight = squareElement.attr("height");
		letterCount = word.length;		
		// TODO Make variable
		fontSize = square[3];
		
		testBbox = getHackBbox(svg, fontSize, "M");	
		charHeight = testBbox.height;
		charWidth = testBbox.width;
		
		console.log("Fitting");
		console.log(squareWidth + " " + charWidth);
		console.log(squareHeight + " " + charHeight);
		colCount = parseInt(squareWidth/charWidth);
		rowCount = parseInt(letterCount/colCount) + (letterCount % colCount > 0 ? 1 : 0);
		padX = 0;//(squareWidth - colCount * charWidth) / 4;				
		console.log(padX);
		index = 0;
		for (j = 0; j < rowCount; j++) {
			// Place the words into the shape.
			for (k = 0; k < colCount; k++) {
				//console.log(rowCount + " " + colCount + " " + j + " " + k);
				//console.log(index);
				if (index < letterCount) {
					curChar = word.substring(index, index + 1);
		
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
					toCenter.attr("x", curPad > 0 ? curPad/2 + curBox.x : curBox.x );
				
				index++;
			}
		}
}


var textElement;
$(document).ready(function() {
	// Index, Name, Shape Color, Translation lists, Rotation lists, scaling lists
	var squares = [[0, "CALIFORNIA", "red", 87],
			[1, "TEXAS", "turquoise", 120],
 			[2, "NEWYORK", "orange", 98], 
 			[3, "WASHINGTON", "pink", 93]
 	];

	var width = 330;//($(window).width()/squares.length) - 5,
		height = 330;

	var svg = d3.select("body").append("svg")
			.attr("width", width * 1000)// squares.length)
			.attr("height", height * 1000)
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
	
	for (i = 0; i < squares.length; i++) {
		squareElement = $("#square"+i);
		//placeGridInSquare(svg, squareElement, squares[i]);
		maxCoverageInSquare(svg, squareElement, squares[i]);
	}	

	
});