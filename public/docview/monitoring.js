steal(
    'jquery',
    'jquery/dom/route',
    'docview/ui/graphing'
.then('docview/bootstrap/bootstrap-dropdown.js').then(
    function() {
	Highcharts.setOptions({
	    global : {
		useUTC : false
	    }
	});
	

	$('.dropdown-toggle').dropdown();
	var cpu_options = {
	    url: "/monitoring/query",
	    varname : "proc.loadavg.5min",
	    y_label: '',
	    x_label: '5min load',
	    title: 'CPU 平均负载',
	    initial_minutes: 120,
	    update_seconds: 30
	};
	
	var disk_options = {
	    url: "/monitoring/query",
	    varname : "df.1kblocks.used",
	    y_label: '',
	    x_label: '',
	    title: '磁盘分区占用（KB）',
	    initial_minutes: 600,
	    label_mapper : convert_df_label_to_name,
	    update_seconds: 180
	};
	
	var mem_options = {
	    url: "/monitoring/query_util",
	    varname : "",
	    extra_params : { type : 'mem' },
	    y_label: '',
	    x_label: '系统内存',
	    title: '内存使用率（%）',
	    initial_minutes: 240,
	    update_seconds: 30
	};
	
	var df_util_options = {
	    url: "/monitoring/query_util",
	    varname : "",
	    extra_params : { type : 'df' },
	    y_label: '',
	    x_label: '',
	    title: '磁盘分区占用率（%）',
	    initial_minutes: 600,
	    update_seconds: 180
	};

	
	$('#cpu-info').docview_ui_graphing({ plot_options : cpu_options });
	$('#cpu-info').docview_ui_graphing('loadDataForHost', 'david-server');
	
	$('#disk-info').docview_ui_graphing({ plot_options : disk_options });
	$('#disk-info').docview_ui_graphing('loadDataForHost', 'david-server');
	$('#mem-info').docview_ui_graphing({ plot_options : mem_options });
	$('#mem-info').docview_ui_graphing('loadDataForHost', 'david-server');
	

	$('#df-util').docview_ui_graphing({ plot_options : df_util_options });
	$('#df-util').docview_ui_graphing('loadDataForHost', 'david-server');
    });