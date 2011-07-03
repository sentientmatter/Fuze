/**
 * A jquery, future, dirt simple js template engine
 *
 * @todo Add more options, such as callback functions to be called when an individual item is fuzed
 *
 * Fuze v0.4
 * Copyright (C) 2011 Sentient Matter
 * Licensed under the MIT license
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
					
					var element = $(selector, self);
					
					methods.applyData.apply(self, [element, item, options]);
				});
			});
		},
		applyData:function(element, data, options){
			if(!element){
				return;
			}
			
			var self = this;
			
			//If the item itself is an array, we need to clone the matched dom element, once for each fuzeable item. 
			//This can be improved upon by checking to see if each element is fuzable BEFORE cloning, so that if non
			//fuzable items exist in the array, the generated html is accurate.
			if($.isArray(data)){
				var original = $(element);
				
				//Since we're operating on an array, we need to save a reference to the last item, so we can easily insert
				//new dom elements after it
				var last = original;
					
				if(original){					
					//Create a blank clone of the target element
					var clone = original.clone(true, true);	
					
					//Now that the clone has been made, we need to recursively add it to the dom and fuze it
					$.each(data, function(key, item){
						if(key > 0){
							//On every instance but the first (since it already exists), we need to append the clone after the last	
							//var cloned = $(selector + ':last', self).after(clone);
							last = clone.clone(true,true).insertAfter(last);
						} else {
							last = original;
						}
						
						//And apply the data
						methods.applyData.apply(self, [last, item, options]);
					});
				}
			} else if(data instanceof Object){console.log('object for data');
				//If the item is an object, then we need to fuze it separately, in the right context (so that it's data
				//only gets fuzed to the correct elements
			
				//If the object contains the toJSON function, call it before fuzing.	
				if(data.toJSON && typeof(data.toJSON) == 'function'){
					data = data.toJSON();
				}
				
				//in order to correctly keep track of all running fuzes (to accurately resolve the deferred), no other
				//fuzing can be asynchronous
				options.asynchronous = false;
				
				$(element).fuze(data, options);
			} else if(typeof(data) == 'string' || 
				typeof(data) == 'number' ||
				typeof(data) == 'boolean'){
					//Only allow fuzing of simple data types
					element.html(data);
					//$('[name=' + key + ']', self).val(item);
			}
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