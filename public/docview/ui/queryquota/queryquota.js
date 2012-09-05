steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    './views/init.ejs','docview/bootstrap/bootstrap.css',
    'docview/datatables/jquery.dataTables.js'
).then(
    'docview/datatables/bootstrap-pagination.js'
).then(function($) {
    $.Controller('Docview.Ui.Queryquota', {}, {
        init : function() {
            //this.element.html(this.view('init'));
        },
	
	loadData: function() {
	    $.ajax({
		url : '/qh/quota',
		type: 'get',
		dataType: 'json',
		success : this.proxy("displayData"),
		error: this.proxy("displayError")
	    });
	},

	displayData: function(data) {
	    if (data.length > 0) {
		this.element.html(this.view('init', data));
		this.element.find('table.query-quota').dataTable({
                    "sDom": "T<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>",
                    //"sDom" : 'T<"clear">lfrtip',
                    "sPaginationType": "bootstrap",
                    "oLanguage" : {
                        "sUrl" : "/docview/media/language/ch_ZN.txt"
                    }
                });
	    } else {
	    	this.element.html('');
	    }
	},
	displayError: function(jqXHR, textStatus, errorThrown) {
	}, 
        show : function() {
        }
    });
});

