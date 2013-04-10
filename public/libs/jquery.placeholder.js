(function() {

	$.fn.placeholder = function() {
		var placeholder = this.attr('placeholder');
		var defaultValue = this.prop('defaultValue');
		(defaultValue == '') && this.val(placeholder);
		this.focus(function(){
			if(this.value == placeholder){
				this.value = '';
			}
		});
		this.blur(function(){
			if(this.value == ''){
				this.value = placeholder;
			}
		});
	};


	$(document).ready(function() {
		(!('placeholder' in document.createElement('input'))) && $('input[placeholder]').placeholder();
	});


})(jQuery);
