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

var data = d3.range(300).map(function(d){
		return {
			x:d/300*w,
			y:Math.random()*h
		}
	});
console.log(data);

//Suppose we have a series of x y coordinates, how do we represent these using <svg>?


//And how do we represent them using <canvas>?

function dataLoaded(err,trips,stations){
	
	//Data model
	var cf = crossfilter(trips);
	var tripsByStartTime = cf.dimension(function(d){return d.startTime}),
		tripsByStartStation = cf.dimension(function(d){return d.startStn}),
		tripsByEndStation = cf.dimension(function(d){return d.endStn});


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