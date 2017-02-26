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
		speedX: Math.random()*.5+1,
		speedY: Math.random()*.5+1,
		update: function(){
			if((this.x+this.speedX)>w || (this.x+this.speedX)<0) this.speedX=-1*this.speedX;
			if((this.y+this.speedY)>h || (this.y+this.speedY)<0) this.speedY = -1*this.speedY;
			this.x += this.speedX;
			this.y += this.speedY;
		}
	}
}

var point1 = Point();

redraw();

function redraw(){
	//Start fresh...
	ctx1.clearRect(0,0,w,h);
	ctx1.fillStyle = 'rgba(0,0,0,.5)';

	//Draw dot representing point1
	ctx1.beginPath();
	ctx1.arc(point1.x,point1.y,5,0,Math.PI*2);
	ctx1.fill();

	//Update point1 for the next go-around
	point1.update();

	//Request next frame/redraw
	requestAnimationFrame(redraw);
}