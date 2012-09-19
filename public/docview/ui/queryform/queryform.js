steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css',
    'docview/docview.css'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Docview.Ui.Queryform', {}, {
        init : function() {
            this.element.html(this.view('init', this.options.formParams));

	    this.form = this.element.find("form.form-horizontal");

	    var form = this.form;
	    var that = this;
	    $.each(this.options.formParams.formFields, function(index, name) {
		if (name == 'org') {
		    var label = that.options.formParams.orgLabel || "理单关区";
		    form.append($.View("//docview/ui/views/org.ejs", {name: "org", label : label }));
		} else if (name == 'org_applied') {
		    var label = that.options.formParams.orgLabel || "申报关区";
		    form.append($.View("//docview/ui/views/org.ejs", {name: "org_applied", label : label }));
		} else if (name == 'daterange') {
		    var label = that.options.formParams.dataRangeLabel || "日期";
		    form.append($.View("//docview/ui/daterange/views/init.ejs", { labelString : label }));
		} else if (name == 'docType') {
		    form.append($.View("//docview/ui/views/frm_docType_years.ejs", { labelString : label }));	    
		} else {
		    form.append(that.view(name));
		}
	    });
	    this.form.append(this.view("button", { buttonLabel : this.options.formParams.buttonLabel }));
        },

        show : function() {
        }
});
});

