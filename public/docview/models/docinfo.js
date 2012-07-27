steal('jquery/model', function() {

    $.Model('Docview.Models.Docinfo',
    /* @Static */
    {
        /*
 起运国
原产地
经营单位
收货单位
关区
商品种类
         **/
        findAll : function(params, success, error) {
            var country_shipment = [{"country_shipment":"China0", "code":1}, {"country_shipment":"China1", "code":2}, {"country_shipment":"China2", "code":3}, {"country_shipment":"China3", "code":4}, {"country_shipment":"China4", "code":5}];
                //5.times.collect {|item| {"types_goods" => "huo_pin_"+item.to_s,"code" => item+1}}
            var country_origin = [{"country_origin":"Beijing0", "code":1}, {"country_origin":"Beijing1", "code":2}, {"country_origin":"Beijing2", "code":3}, {"country_origin":"Beijing3", "code":4}, {"country_origin":"Beijing4", "code":5}];
            var business_units = [{"business_units":"Tea0", "code":1}, {"business_units":"Tea1", "code":2}, {"business_units":"Tea2", "code":3}, {"business_units":"Tea3", "code":4}, {"business_units":"Tea4", "code":5}];
            var receiving_unit = [{"receiving_unit":"Houqin0", "code":1}, {"receiving_unit":"Houqin1", "code":2}, {"receiving_unit":"Houqin2", "code":3}, {"receiving_unit":"Houqin3", "code":4}, {"receiving_unit":"Houqin4", "code":5}];
            var customs_area = [{"customs_area":"org0", "code":1}, {"customs_area":"org1", "code":2}, {"customs_area":"org2", "code":3}, {"customs_area":"org3", "code":4}, {"customs_area":"org4", "code":5}];
            var types_goods = [{"types_goods":"huo_pin_0", "code":1}, {"types_goods":"huo_pin_1", "code":2}, {"types_goods":"huo_pin_2", "code":3}, {"types_goods":"huo_pin_3", "code":4}, {"types_goods":"huo_pin_4", "code":5}];
            var result = {
                country_shipment:country_shipment,
                country_origin:country_origin,
                business_units:business_units,
                receiving_unit:receiving_unit,
                customs_area:customs_area,
                types_goods:types_goods
            }
            return result
            
            /*
            return $.ajax({
                url : '/documents/multi_query',
                type : 'post',
                data : params,
                success : success,
                error : error,
		
                dataType : 'json'
            });
             */
        }
    },
    /* @Prototype */
    {});

});