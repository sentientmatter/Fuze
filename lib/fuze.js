/**
 * Based on the weld.js concept, but rewritten in jquery and made future.
 *
 * @todo Add more options, such as callback functions to be called when an individual item is fuzed
 */

(function($){
	var methods = {
		doFuze:function(data, options){
			var self = this;
			
			//Loops over every matched element from the jquery selector
			self.each(function(){
				//Loop over all items in the data, fuzing any found html elements with their values
				$.each(data, function(key, item){
					var selector = '#' + key + ', ' + '.' + key;
					
					//If the item itself is an array, we need to clone the matched element, once for each fuzeable item. 
					//This can be improved upon by checking to see if each element is fuzable BEFORE cloning it, so that if non
					//fuzable items exist in the array, the generated html is accurate.
					
					if($.isArray(item)){
						
					} else if(item instanceof Object){
						//If the item is an object, then we need to fuze it separately, in the right context (so that it's data
						//only gets fuzed to the correct elements
					
						//If the object contains the toJSON function, call it before fuzing.	
						if(item.toJSON && typeof(item.toJSON) == 'function'){
							item = item.toJSON();
						}
						
						//in order to correctly keep track of all running fuzes (to accurately resolve the deferred), no other
						//fuzing can be asynchronous
						options.asynchronous = false;
						
						$(selector, self).fuze(item, options);
					} else if(typeof(item) == 'string' || 
						typeof(item) == 'number' ||
						typeof(item) == 'boolean'){
							//Only allow fuzing of simple data types
							self.find(selector).html(item);
							self.find('[name=' + key + ']').val(item);
					}
				});
			});
		}
	}
	
	$.fn.fuze = function (data, options){
		var deferred = $.Deferred();
		var self = this;
		
		var defaults = {
			asynchronous: true	
		}
		
		options || (options = {});
		
		options = $.extend(defaults, options);
		
		//Go asynchronous, if requested. Usually, the only reason to go synchronous is internally, to keep track of all the fuzing
		//and accurately resolve the deferred
		if(options.asynchronous){
			setTimeout(function(){
				methods.doFuze.apply(self, [data, options]);
			
				//Finally resolve the deferred
				deferred.resolveWith(self);
			}, 0);
		} else {
			//Regular synchronous request, no set timeout. Usually the result of a recursive fuze.
			methods.doFuze.apply(self, [data, options]);
			
			//Finally resolve the deferred
			deferred.resolveWith(self);
		}
		
		return deferred.promise(this);
	};
})(jQuery)