function TimeseriesCanvas(){

	var T0 = new Date(2011,0,1),
		T1 = new Date(2013,11,31);
	var _interval = d3.timeDay;
	var _accessor = function(d){
		return d.startTime;
	};
	var w,h,W,H,M ={t:30,r:40,b:30,l:40};
	var brush = d3.brushX()
		.on('end',brushend);
	var scaleX, scaleY;
	var _dispatcher = d3.dispatch('timerange:select');

	var _brushable = true;

	var exports = function(selection){
		//Set initial internal values
		//Some of these will be based on the incoming selection argument
		W = W || selection.node().clientWidth - M.l - M.r;
		H = H || selection.node().clientHeight - M.t - M.b;
		w = W - M.l - M.r;
		h = H - M.t - M.b;
		var arr = selection.datum()?selection.datum():[];

		//Set brush extent
		brush.extent([[0,0],[w,h]]);

		//Histogram layout
		//The value, domain and threshold properties are internal to this function
		var histogram = d3.histogram()
			.value(_accessor)
			.domain([T0,T1])
			.thresholds(_interval.range(T0,T1,1));

		var dayBins = histogram(arr);

		var maxY = d3.max(dayBins,function(d){return d.length});
		scaleX = d3.scaleTime().domain([T0,T1]).range([0,w]),
		scaleY = d3.scaleLinear().domain([0,maxY]).range([h,0]);

		//Represent
		//Axis, line and area generators
		var line = d3.line()
			.x(function(d){return scaleX(d.x0)})
			.y(function(d){return scaleY(d.length)});
		var area = d3.area()
			.x(function(d){return scaleX(d.x0)})
			.y0(function(d){return h})
			.y1(function(d){return scaleY(d.length)});
		var axisX = d3.axisBottom()
			.scale(scaleX)
			.ticks(d3.timeMonth.every(3));
		var axisY = d3.axisLeft()
			.tickSize(-W)
			.scale(scaleY)
			.ticks(4);

		//Set up the DOM structure like so:
		/*
		<svg>
			<g class='plot'>
				<g class='axis axis-y' />
				<g class='axis axis-x' />
				<g class='brush' />
			</g>
		</svg>
		<canvas>
		</canvas>
		*/

		//The <canvas> portion
		selection.selectAll('canvas').data([1]).enter().append('canvas');
		var canvas = selection.select('canvas')
			.attr('width',W)
			.attr('height',H)
			.style('position','absolute') //this ensures that <canvas> and <svg> line up
			.style('top',0)
			.style('left',0)
			.style('pointer-events','none') //canvas element will not interact; all events are captured by <svg> instead
			.node()
		var ctx = canvas.getContext('2d');

		ctx.fillStyle = 'rgba(255,0,0,.1)';
		ctx.strokeStyle = 'rgb(255,0,0)';
		ctx.lineWidth = 1;

		var pathLine = new Path2D( line(dayBins) ),
			pathArea = new Path2D( area(dayBins) );

		ctx.translate(M.l,M.t);
		ctx.fill(pathArea);
		ctx.stroke(pathLine);


		//The <svg> portion
		var svg = selection.selectAll('svg')
			.data([dayBins]);

		//The enter set --> append the right DOM structure
		var svgEnter = svg.enter()
			.append('svg') //ENTER
			.attr('width', W)
			.attr('height', H);

		var plotEnter = svgEnter.append('g').attr('class','plot time-series')
			.attr('transform','translate('+M.l+','+M.t+')');

		plotEnter.append('g').attr('class','axis axis-x');
		plotEnter.append('g').attr('class','axis axis-y');
		plotEnter.append('g').attr('class','brush');

		//Enter + update
		var plot = svg.merge(svgEnter).select('.plot');

		plot.select('.axis-x')
			.attr('transform','translate(0,'+h+')')
			.call(axisX);
		plot.select('.axis-y').call(axisY);
		plot.select('.brush').call(brush);
	}

	function brushend(){
		if(!d3.event.selection) {_dispatcher.call('timerange:select',this,null); return;}
		var t0 = scaleX.invert(d3.event.selection[0]),
			t1 = scaleX.invert(d3.event.selection[1]);
		_dispatcher.call('timerange:select',this,[t0,t1]);
	}

	//setting config values
	//"Getter" and "setter" functions
	exports.domain = function(_){
		if(!arguments.length) return [T0,T1];
		T0 = _[0];
		T1 = _[1];
		return this;
	}

	exports.interval = function(_){
		_interval = _;
		return this;
	}

	exports.value = function(_){
		if(!arguments.length) return _accessor;
		_accessor = _;
		return this;
	}

	exports.on = function(){
		_dispatcher.on.apply(_dispatcher,arguments);
		return this;
	}

	exports.brushable = function(_){
		if(!arguments.length) return _brushable;
		_brushable = _;
		return this;
	}

	return exports;
}
