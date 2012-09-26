steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css',
    'docview/docview.css'
).then(
    'docview/ui/daterange',
    'docview/ui/single',
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Queryform', {}, {
        init : function() {
            this.element.html(this.view('init', this.options.formParams));

	    this.form = this.element.find("form.form-horizontal");

	    var form = this.form;
	    var that = this;
	    this.dateRangeController = undefined;
	    this.docidController = undefined;

	    $.each(this.options.formParams.formFields, function(index, name) {
		if (name == 'org') {
		    var label = that.options.formParams.orgLabel || "理单关区";
		    form.append($.View("//docview/ui/views/org.ejs", {name: "org", label : label }));
		} else if (name == 'org_applied') {
		    var label = that.options.formParams.orgAppliedLabel || "申报关区";
		    form.append($.View("//docview/ui/views/org.ejs", {name: "org_applied", label : label }));
		} else if (name == 'daterange') {
		    form.append(that.view(name));
		    var label = that.options.formParams.dataRangeLabel || "日期";	
		    form.find("div.dr-holder").docview_ui_daterange({dateOptions: {labelString: label} });
	
		    this.dateRangeController = form.find("div.dr-holder").controller();

		    //form.append($.View("//docview/ui/daterange/views/init.ejs", { labelString : label }));
		} else if (name == 'docid') {
		    form.append(that.view(name));
		    var label = that.options.formParams.docidLabel || '报关单号';
		    form.find("div.docid-holder").docview_ui_single({label : {labelString: label} });
	
		    this.docidController = form.find("div.docid-holder").controller();
		} 
		else if (name == 'docType') {
		    form.append($.View("//docview/ui/views/frm_docType_years.ejs", { labelString : label }));	    
		} else {
		    form.append(that.view(name));
		}
	    });
	    this.form.append(this.view("button", { buttonLabel : this.options.formParams.buttonLabel }));
        },

	getFormValues : function(jsonObject) {
	    if (this.docidController) {
		if (!this.docidController.validateInputOrEmpty(this.form)) {
		    return;
		} 
	    }
	},

        show : function() {
        }
});
});

