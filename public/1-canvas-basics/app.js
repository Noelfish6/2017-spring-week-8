//A warm-up exercise for canvas
//You can review this series of useful API docs here:
//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/

//Part 1: Append a <canvas> element under <div id='plot1'> with the same width and height as the container element
//Store drawing context as a variable
//Hint: use canvas.getContext('2d');
//Optional: offset drawing context by a left and top margin
var W = d3.select('#plot1').node().clientWidth,
	H = d3.select('#plot1').node().clientHeight,
	m = {t:0,r:0,b:0,l:0},
	w = W - m.l - m.r,
	h = H - m.t - m.b;
var canvas1 = d3.select('#plot1').append('canvas').attr('width',W).attr('height',H)
	.node();
var ctx1 = canvas1.getContext('2d');

//Part 2: Draw a gray background, with fillStyle = 'rgb(250,250,250)'
ctx1.fillStyle = 'rgb(250,250,250)';
ctx1.fillRect(0,0,W,H);
ctx1.translate(m.l,m.t);

//Part 3: Draw a x and y grid, spaced 50px apart, with strokeStyle = 'rgb(180,180,180)'
//Hint: use context2D.beginPath and context2D path commands within two for... loops
//context2D path commands here: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
ctx1.strokeStyle = 'rgb(180,180,180)';
ctx1.lineWidth = 1;

ctx1.beginPath()
for(var i = 0; i <= w; i +=50){
	ctx1.moveTo(i,0);
	ctx1.lineTo(i,h);
}
for(var i = 0; i <=h; i+= 50){
	ctx1.moveTo(0,i);
	ctx1.lineTo(w,i);
}
ctx1.stroke();

//Part 4: Draw a filled red rectangle at (50,50), with width = 20 and height = 20
//Draw a rectangle with red border at (150,50), with width = 20 and height = 20
//Hint: use context2D.fillRect and context2D.strokeRect
ctx1.fillStyle = 'red';
ctx1.fillRect(50,50,20,20);
ctx1.strokeStyle = 'red';
ctx1.strokeRect(150,50,20,20);


// Part 5: Draw a series of circles and a quadratic curve using the context2D path commands, as shown in image
var path1 = new Path2D(),
	path2 = new Path2D(),
	path3 = new Path2D();

path1.moveTo(150,200);
path1.arc(100,200,50,0,Math.PI*2);

path2.moveTo(450,200);
path2.arc(400,200,50,0,Math.PI*2);

path2.moveTo(750,200);
path2.arc(700,200,50,0,Math.PI*2);

path2.moveTo(100,200);
path2.quadraticCurveTo(250,100,400,200);
path2.quadraticCurveTo(550,300,700,200);

ctx1.stroke(path2);

ctx1.save();
ctx1.globalAlpha = .5;
ctx1.fill(path1);
ctx1.restore();

//path3 is meant to show how quadratic curves are constructed
path3.moveTo(100,200);
path3.lineTo(250,100);
path3.lineTo(400,200);
path3.moveTo(250,100);
path3.arc(250,100,3,0,Math.PI*2)


// Part 6: Label each circle with coordinates
// Hint: context2D.fillText
ctx1.fillStyle = 'rgba(50,50,50,.7)';
ctx1.fillText('(100,200)',100,200);
ctx1.fillText('(400,200)',400,200);
ctx1.fillText('(700,200)',700,200);

//Save canvas style settings to be restored later
ctx1.save();

//Stroke path3 to show how quadratic curves are constructed
ctx1.strokeStyle = 'blue';
ctx1.fillStyle = 'blue';
ctx1.setLineDash([4,2]);
ctx1.stroke(path3);
ctx1.fillText('Quadratic curve needs a control point at (250,100)',255,95);

ctx1.restore();


// Part 7: append a new <canvas> element under <div id='plot2'>, and copy the content of the first canvas onto it
var canvas2 = d3.select('#plot2').append('canvas').attr('width',w).attr('height',h)
	.node();
var ctx2 = canvas2.getContext('2d');
ctx2.globalAlpha = .5;
ctx2.drawImage(canvas1,0,0);
