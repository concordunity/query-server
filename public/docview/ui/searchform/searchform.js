steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
    ).then(
    'docview/bootstrap/bootstrap.css',
    'docview/datatables/jquery.dataTables.js'
    ).then(
    'docview/datatables/bootstrap-pagination.js'
    ).then(
    './views/init.ejs',
    "./views/search_result_list.ejs"
    ).then(
    'libs/jquery.i18n.min.js'
    ).then(function($) {
    $.Controller('Docview.Ui.Searchform', {}, {
        init : function() {
            
            this.element.html(this.view('init',this.options));
        },

        show : function() {
        },
        'td a click': function(el, ev) {
            ev.preventDefault();
            var document = el.closest('tr').model();
            //$.route.attrs({category: 'document', id: document.doc_id}, true);
            $('#document-details').docview_ui_details('queryDoc', document.doc_id);
            $('#searchform-test').hide();
        },

        show_stats : function(data){
            var dmstable_params = "<'row-fluid'<'span6'l><'pull-right'f>r>t<'row-fluid'<'span6'i><'pull-right'p>>";
            this.element.find('div.search_result_list').html(this.view('search_result_list', data));
            console.log(data);

            this.element.find('div.search_result_list table').dataTable({
                "sDom": dmstable_params,
                "oTableTools": {
                    "aButtons": [
                    {
                        "sExtends": "copy",
                        "sButtonText": "复制"
                    },
                    {
                        "sExtends": "csv",
                        "sButtonText": "保存CSV"
                    },
                    {
                        "sExtends": "xls",
                        "sButtonText": "保存Excel"
                    }]
                },
                //"sDom" : 'T<"clear">lfrtip',
                "sPaginationType": "bootstrap",
                "oLanguage" : {
                    "sUrl" : "/docview/media/language/ch_ZN.txt"
                }
            });
        },
        failure : function(){

        },
        //        submitCondition : function(el,ev){
        ".advanced submit" : function(el,ev){
            ev.preventDefault();
            //alert("=====");
            var select_hash = {};

            var country_shipment = el.find('select[name="country_shipment"]').val();
            var country_origin = el.find('select[name="country_origin"]').val();
            var business_units = el.find('select[name="business_units"]').val();
            var receiving_unit = el.find('select[name="receiving_unit"]').val();
            var customs_area = el.find('select[name="customs_area"]').val();
            var types_goods = el.find('select[name="types_goods"]').val();
            console.log("country_origin=",country_origin);
            select_hash = {
                "country_shipment":country_shipment,
                "country_origin":country_origin,
                "business_units":business_units,
                "receiving_unit":receiving_unit,
                "customs_area":customs_area,
                "types_goods":types_goods
            };
            console.log(select_hash);
            $.ajax({
                url : '/search_form',
                type : 'post',
                data : {
                    condition_value : select_hash
                },
                dataType : 'json',
                success : this.proxy('show_stats'),
                error : this.proxy('failure')
            });
        }

    });
});

