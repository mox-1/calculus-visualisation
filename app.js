(function() {

var canvasHeight = 500;
var canvasWidth = 800;
var pointerHeight = 600;
var dt = 20;
var dt_width = 2;

var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

// our formulae (soon to be parameterised)
var originalFormula = Math.sin;
var derivativeFormula = Math.cos;

var scaledFormula = function(formula, x) {
	return formula(x/75) * 100 + 120;
}

// color of highlights
var posColor = 'rgba(200, 20, 20, 0.4)';
var negColor = 'rgba(20, 200, 20, 0.4)';

// distance of canvas from left of screen
var offsetLeft = ((width - canvasWidth) /2) > 0 ? ((width - canvasWidth) /2) : 0 ;

// list of canvases with their formula to draw
var canvases = [
	{
		name: 'canvas.original', 
		fcn: originalFormula
	},
	{
		name: 'canvas.derivative', 
		fcn: derivativeFormula
	}
]

canvases.forEach(function(canvas) {
	var c = document.querySelector(canvas.name);
	var ctx = c.getContext('2d');

	// draw y axis
	ctx.beginPath();
	ctx.moveTo(0, 120);
	ctx.lineTo(canvasWidth, 120);
	ctx.stroke();

	// draw x axis
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, canvasHeight);
	ctx.stroke();

	// draw function curves
	ctx.beginPath();
	ctx.moveTo(0, scaledFormula(canvas.fcn, 0));
	for(var i = 1; i < canvasWidth; i++) {
		ctx.lineTo(i,scaledFormula(canvas.fcn, i));
		ctx.stroke();
	}
})


var pointer = document.querySelector('.pointer');
var pointer2 = document.querySelector('.pointer2');
var fillDiv = document.querySelector('.fill');
var delta_x = document.querySelector('.delta_x');

var dt_element = document.querySelector('.dt');
	dt_element.style.width = dt;
var dy_element = document.querySelector('.dy');

document.addEventListener('mousemove', function(event) {
	var x;
	if (event.clientX - offsetLeft < 0) {
		x = 0;
	} else if (event.clientX - offsetLeft > canvasWidth - dt) {
		x = canvasWidth - dt;
	} else {
		x = event.clientX - offsetLeft
	}

	// adjust long vertical lines with mouse position
	pointer.style.left = x;
	pointer.style.top = scaledFormula(originalFormula, x);
	pointer.style.height = pointerHeight - scaledFormula(originalFormula, x);

	pointer2.style.left = x + dt;
	pointer2.style.top = scaledFormula(originalFormula, x);
	pointer2.style.height = pointerHeight - scaledFormula(originalFormula, x);

	// adjust highlighted area under curve with mouse position
	fillDiv.style.width = dt + 2;
	fillDiv.style.left = x;

	// adjust label with mouse position
	delta_x.style.left = x;

	// adjust position of 'dt' line with mouse position
	dt_element.style.left = x;
	dt_element.style.top = scaledFormula(originalFormula, x);

	// what height should the 'dy' line be?
	var dy_offset = scaledFormula(originalFormula, x) - scaledFormula(originalFormula, x + dt);

	// 'dy' element should be offset to the right of the pointer
	dy_element.style.left = x + dt;

	// change styling of 'dy' line based on positive/negative gradient
	if (dy_offset > 0) {
		dy_element.style.top = scaledFormula(originalFormula, x + dt);
		dy_element.style.height = Math.abs(dy_offset) + dt_width;
		dy_element.style.background = posColor;
	} else {
		dy_element.style.height = Math.abs(dy_offset);
		dy_element.style.top = scaledFormula(originalFormula, x);
		dy_element.style.background = negColor;
	}

	var derivativeValue = scaledFormula(derivativeFormula, x);

	// change styling of highlighted area according to dy/dx being positive/negative (<120 with scaling)
	if (derivativeValue < 120) {
		fillDiv.style.top = derivativeValue;
		fillDiv.style.height = 120 - derivativeValue; // since 120px from top is the position of 0 mark
		fillDiv.style.background = posColor;
	} else {
		fillDiv.style.top = 120;
		fillDiv.style.height = derivativeValue - 120;
		fillDiv.style.background = negColor;
	}
});
})()
