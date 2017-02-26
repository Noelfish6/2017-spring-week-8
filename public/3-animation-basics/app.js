var w = d3.select('#plot1').node().clientWidth,
	h = d3.select('#plot1').node().clientHeight;

//Main canvas
var canvas1 = d3.select('#plot1').append('canvas')
	.attr('width',w)
	.attr('height',h)
	.node();
var ctx1 = canvas1.getContext('2d');

//With the help of a second canvas, we can create cool effects such as motion trails
var canvas2 = d3.select('#plot1').append('canvas')
	.attr('width',w)
	.attr('height',h)
	.node();
var ctx2 = canvas2.getContext('2d');

//Use a function to generate a random point
var Point = function(){
	return {
		x:Math.random()*w,
		y:Math.random()*h,
		speedX: Math.random()*.05,
		speedY: Math.random()*.05,
		update: function(){
			console.log(this);
		}
	}
}

var point1 = Point();
point1.update();