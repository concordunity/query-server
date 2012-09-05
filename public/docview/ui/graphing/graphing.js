steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/dom/route',
    'jquery/lang/observe/delegate'
).then(
    'libs/highcharts/js/highcharts.src.js',
    './views/init.ejs',
    'docview/models'
).then(
    'libs/highcharts/js/modules/exporting.src.js'
).then(function($) {
    $.Controller('Docview.Ui.Graphing', {}, {
        init : function() {
            this.element.html(this.view('init'));
	    this.chart = undefined;
	    this.last_ts = 0;
	    this.host = undefined;
	    this.timer = undefined;

	    this.seriesNames = new Array();
        },
        loadDataForHost : function(host) {
	    if (this.timer) {
		this.timer = null;
		clearTimeout(this.timer);
	    }
//	    this.host = host + ".sh.intra.customs.gov.cn";
            this.host = host;


	    if (!this.chart) {
		this.initializeChart();
	    } else {
		this.chart.destroy();
		this.chart = undefined;
		this.last_ts = 0;

		this.timer = undefined;
		
		this.seriesNames = new Array();

		this.initializeChart();
//		this.loadData();
	    }
	},
	findIndex : function(name) {
	    var len = this.seriesNames.length;
	    for (var i=0; i<len; i++) {
		if (this.seriesNames[i] == name) {
		    return i;
		}
	    }
	    this.seriesNames.push(name);
	    return -1;
	},
	initializeChart : function() {
	    this.chart = new Highcharts.Chart({
		chart: {
		    renderTo: this.element.find('.graph-container')[0],
		    defaultSeriesType: 'line',
		    events: {
			load: this.proxy('loadData')
		    }
		},
		title: {
		    text: this.options.plot_options.title
		},
		credits: {
		    href: '/docview/docview.html',
		    text: '存量单证电子化管理系统'
		},
		exporting: {
		    enabled: true
		},
		xAxis: {
		    type: 'datetime',
		    tickPixelInterval: 120,
		    maxZoom: 20 * 1000,
		    formatter: function(data) {
			new Date(data).format('MM:dd h:mm');
		    }
		},
		yAxis: {
		    minPadding: 0.2,
		    maxPadding: 0.2,
		    title: {
			text: this.options.plot_options.y_label,
			margin: 80
		    }
		},
		series: []
            });
	},
	requestIncrementalData: function() {
	    var now_seconds = new Date().getTime() / 1000;
	    var varname = this.options.plot_options.varname;
	    $.ajax({
		url: this.options.plot_options.url,
		type: 'post',
		data: $.extend({
		    host : this.host, 
		    varname : this.options.plot_options.varname,
		    from_ts : this.last_ts,
		    to_ts: now_seconds,
		    step : "60" 
		}, this.options.plot_options.extra_params),
		dataType: 'json',
		
		success: this.proxy('handleData'),
		cache: false
	    });
	    // request for 2 hours of data
	},



	'{$.route} change' : function(el, ev, attr, how, newVal, oldVal) {
	    //console.log("change ", el, ev, attr, how, newVal, oldVal);
	},
	loadData: function() {	
	    var now_seconds = new Date().getTime() / 1000;
	    var varname = this.options.plot_options.varname;
	    var from_ts = now_seconds - 60 * this.options.plot_options.initial_minutes;
	    this.last_ts = from_ts;

	    Docview.Models.Monitoring.getData(
		this.options.plot_options.url,
		$.extend({
		    host : this.host, 
		    varname : this.options.plot_options.varname,
		    from_ts : from_ts,
		    to_ts: now_seconds,
		    step : "60" 
		}, this.options.plot_options.extra_params),
		this.proxy('handleData'),
		this.proxy('handleFailure')
	    );
	},
	handleFailure : function(er) {
	},

	handleData : function(data) {
	    var chart = this.chart;

	    var plot_options = this.options.plot_options;

	    var that = this;

	    var label_mapper = plot_options.label_mapper;
	    var x_label = plot_options.x_label;

	    $.each(data, function(key, points) {
		var name = key;
		if (label_mapper) {
		    name = label_mapper(key);
		    if (name == null) {
			return true;
		    }
		}
		if (!name) {
		    name = x_label;
		}
		var index = that.findIndex(name);
		if (index == -1) {
		    chart.addSeries({name: name, data :points});
		} else {
		    var series = chart.series[index];
		
		    if (points.length > 0) {
			var shift = series.data.length > 120;
			for (var i=0; i<points.length; i++) {
			    series.addPoint(points[i], true, shift);
			}
		    }
		}
		if (points.length > 0) {
		    that.last_ts = points[points.length -1][0] / 1000;
		}
	    });

	    //this.chart.series[0].addPoint([now_seconds, 0.6], true, true);
	    this.timer = setTimeout(this.proxy('requestIncrementalData'),
				    1000 * this.options.plot_options.update_seconds); 
	}
});
});

