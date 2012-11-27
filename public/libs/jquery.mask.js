/**
 * [ jQueryMask.js]
 * Lsong
 * i@lsong.org
 * http://lsong.org
 */
(function($){
	$.extend($,{
		/**
		 * [createMask description]
		 * @return {[type]} [description]
		 */
		createMask:function() {
			
			var width = document.documentElement.clientWidth;
			var height = document.documentElement.clientHeight;
			var mask = document.createElement('div');
			mask.id = '_mask_';
			mask.style.zIndex = 2001;
			mask.style.top = '0px';
			mask.style.left = '0px';
			mask.style.width = width +'px';
			mask.style.height = height +'px';
			mask.style.position = 'fixed';
			mask.style.backgroundColor = '#ccc';
			mask.style.filter = 'Alpha(Opacity=50, Style=0)';
			mask.style.opacity = '0.50';
			document.body.appendChild(mask);
			
			var loading_size = 300;
			var loading = document.createElement('div');
			loading.style.zIndex = 2002;
			//loading.style.backgroundColor = '#333';
			loading.style.padding = '50px';
			loading.style.width = loading_size + 'px';
			loading.style.height = loading_size + 'px';
			loading.style.position = 'fixed';
			loading.style.top = '60%';
			loading.style.left = '50%';
			loading.style.margin = -(loading_size/2) + 'px';
			loading.style.color = '#000';	
			loading.style.textAlign = 'center';
			var loading_image = document.createElement('img');
			loading_image.src = 'img/loading.gif';
			
			loading.appendChild(loading_image);

			var loading_text = document.createElement('p');
			loading.id = 'mask-loading';
			loading_text.style.marginTop = '10px';
			loading_text.innerText = '正在查询中，请稍候...';
			loading.appendChild(loading_text);
			document.body.appendChild(loading);			
		},
		/**
		 * [closeMask description]
		 * @return {[type]} [description]
		 */
		 closeMask:function(){				
				var mask  = document.getElementById('_mask_');
				mask && mask.parentNode.removeChild(mask);
				var loading = document.getElementById('mask-loading');
				loading && loading.parentNode.removeChild(loading);				
			}
		});

})(jQuery);
