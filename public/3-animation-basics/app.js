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
		speedX: Math.random()*1-.5,
		speedY: Math.random()*1-.5,
		update: function(){
			if((this.x+this.speedX)>w || (this.x+this.speedX)<0) this.speedX=-1*this.speedX;
			if((this.y+this.speedY)>h || (this.y+this.speedY)<0) this.speedY = -1*this.speedY;
			this.x += this.speedX;
			this.y += this.speedY;
		}
	}
}

var points = d3.range(500).map(function(){
	return Point();
});

//Use stats library to monitor performance
var stats = new Stats();
document.body.appendChild(stats.dom);

redraw();

function redraw(){
	stats.begin();

	//Start fresh...
	ctx1.clearRect(0,0,w,h);
	ctx1.fillStyle = 'rgba(0,0,0,.5)';

	//Draw dot representing point1
	ctx1.beginPath();
	points.forEach(function(point){
		ctx1.moveTo(point.x,point.y);
		ctx1.arc(point.x,point.y,3,0,Math.PI*2);
		point.update();
	})
	ctx1.fill();

	stats.end();

	//Request next frame/redraw
	requestAnimationFrame(redraw);
}