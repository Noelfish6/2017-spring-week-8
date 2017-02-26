d3.queue()
	.defer(d3.csv,'../data/hubway_trips_reduced.csv',parseTrips)
	.defer(d3.csv,'../data/hubway_stations.csv',parseStations)
	.await(dataLoaded);

//Part 1: Path to canvas basics
var m = {t:20,r:20,b:20,l:20},
	W = d3.select('#plot1').node().clientWidth,
	H = d3.select('#plot1').node().clientHeight,
	w = W - m.l - m.r,
	h = H - m.t - m.b;

var data = d3.range(100).map(function(d){
		return {
			x:d/100*w,
			y:Math.random()*h
		}
	});
console.log(data);

//Suppose we have a series of x y coordinates, how do we represent these using <svg>?
var plotSvg = d3.select('#plot1').append('svg')
	.attr('width',W).attr('height',H)
	.append('g')
	.attr('transform','translate('+m.l+','+m.t+')');

//And how do we represent them using <canvas>?
var canvas = d3.select('#plot1').append('canvas')
	.attr('width',W).attr('height',H)
	.style('position','absolute')
	.style('top',0)
	.style('left',0)
	.node();
var ctx = canvas.getContext('2d');
ctx.translate(m.l,m.t);

//Whether rendering in <svg> or <canvas>, we can still use d3's handy line generator functions
var line = d3.line()
	.x(function(d){return d.x})
	.y(function(d){return d.y})
	.curve(d3.curveBasis);

var area = d3.area()
	.x(function(d){return d.x})
	.y1(function(d){return d.y})
	.y0(h)
	.curve(d3.curveBasis)
	.context(ctx);

//Rendering with <svg>
plotSvg.append('path').datum(data)
	.attr('d',line)
	.style('fill','none').style('stroke','rgb(150,150,150)').style('stroke-width','2px');

//Rendering with <canvas>
//Path2D() can accept an <svg> "d" attribute as an argument, and convert it to canvas path commands
ctx.strokeStyle = 'rgb(20,20,20)';
var pathCanvas = new Path2D(line(data));
ctx.stroke(pathCanvas);

ctx.fillStyle = 'rgba(0,0,0,.03)';
area(data);
ctx.fill();

//Part 2
function dataLoaded(err,trips,stations){
	
	//Data model
	var cf = crossfilter(trips);
	var tripsByStartTime = cf.dimension(function(d){return d.startTime}),
		tripsByStartStation = cf.dimension(function(d){return d.startStn}),
		tripsByEndStation = cf.dimension(function(d){return d.endStn});

	d3.select('#plot2').datum(tripsByStartTime.top(Infinity)).call(TimeseriesCanvas());
}

function parseTrips(d){
	return {
		bike_nr:d.bike_nr,
		duration:+d.duration,
		startStn:d.strt_statn,
		startTime:parseTime(d.start_date),
		endStn:d.end_statn,
		endTime:parseTime(d.end_date),
		userType:d.subsc_type,
		userGender:d.gender?d.gender:undefined,
		userBirthdate:d.birth_date?+d.birth_date:undefined
	}
}

function parseStations(d){
	return {
		id:d.id,
		lngLat:[+d.lng,+d.lat],
		city:d.municipal,
		name:d.station,
		status:d.status,
		terminal:d.terminal
	}
}

function parseTime(timeStr){
	var time = timeStr.split(' ')[1].split(':'),
		hour = +time[0],
		min = +time[1],
		sec = +time[2];

	var	date = timeStr.split(' ')[0].split('/'),
		year = date[2],
		month = date[0],
		day = date[1];

	return new Date(year,month-1,day,hour,min,sec);
}