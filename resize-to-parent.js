$.fn.resizeToParent = function(options) {
	
	return this.each(function() {
	    var o = $.extend({}, options || {});
	    var obj = $(this);
		var src = obj.attr('src');
		
		var parent = (typeof(o.parent) != "undefined")? obj.parents(o.parent) : obj.parent();
		
		parent.unbind("mousemove").addClass('loading');
		
	    // bind to load of image
	    obj.load(function() {
	    	
	    	if(!obj.width() || !obj.height()){
	    		return;
	    	}
			// dimensions of the parent
	      	if(!obj.data("ow") && obj.width()) obj.data("ow", obj.width());
	      	if(!obj.data("oh") && obj.height()) obj.data("oh", obj.height());
	      	
			var w = obj.data("ow");
			var h = obj.data("oh");
			var pw = parent.width();
			var ph = parent.height();
			var tw, th;
			
			// if(src == "http://localhost/taijha/uploads/08.jpg") {
				// console.log("w: %s, h: %s", w, h)
			// }			
			tw = pw;
			th = Math.ceil(pw/w*h);
			
			if(o.type == 'fixed') {
				if(th > ph){
					th = ph;
					tw = Math.ceil(ph/h*w);
				}	
			}
			else{
				if(th < ph){
					th = ph;
					tw = Math.ceil(ph/h*w);
				}	
			}
			
			
			
			var css = {
	      		width: tw + 'px'
	      		, height: th + 'px'
	      		, maxWidth: 'none'
	      		, minWidth: 'none'
	      		, maxHeight: 'none'
	      		, minHeight: 'none'
	  		};
	  		
	  		
	  		if(o.align == "lt"){
	  			css = $.extend(css, {
	  				left: '0'
		      		, top: '0'
		      		, margin: '0 0 0 ' + ((o.align == 'lt')? 0 : parseInt(-tw/2)) + 'px'
		      		, float: 'left'
		      		, position: 'relative'
	  			});
	  		}
	  		else if(o.align == "rt"){
	  			css = $.extend(css, {
	  				right: '0'
		      		, top: '0'
		      		, margin: '0'
		      		, float: 'right'
		      		, position: 'relative'
	  			});
	  		}
	  		else{
	  			css = $.extend(css, {
	  				left: Math.floor(pw/2) + 'px'
		      		, top: Math.floor(ph/2) + 'px'
		      		, margin: parseInt(-th/2) + 'px 0 0 ' + ((o.align == 'lt')? 0 : parseInt(-tw/2)) + 'px'
		      		, position: 'absolute'
	  			});
	  		}
	  		
	  		
	      	obj.css(css);
	      	
	      	if(o.fadeIn){
	      		obj.hide().fadeIn(o.fadeIn, function(){
	      			if(o.zoom == 'drag'){
	      				$(this).draggable({scroll: false});
	      			}
	      			else if(o.zoom == 'flow') {
	      				var ow = obj.width(), oh = obj.height(), pw = parent.width(), ph = parent.height();
	      				parent.bind("mousemove", function(e){
	      					
	      					if(ow <= pw && oh <= ph) return;
	      					
	      					var wdiff = (pw >= ow)? 0 : ow-pw;
	      					var hdiff = (ph >= oh)? 0 : oh-ph;
	      					
	      					var mx = e.pageX, my = e.pageY;
	      					
	      					var perx = mx / pw, pery = my / ph;
	      					
	      					var x = -pw/2 - wdiff * perx, y = -ph/2 -hdiff * pery;
	      					
	      					obj.stop().animate({
	      						marginLeft: x
	      						, marginTop: y
	      						, opacity: 1
	      					}, 300, "linear")						
	      				});
	      			}
	      		});
	      	}
	      	else{
	      		obj.show();
	      	}
	      	
	      	if(o.onShow){
	      		o.onShow();
	      	}
	      	
	      	parent.removeClass('loading');
	    });
		
	    // force ie to run the load function if the image is cached
	    if (this.complete) {
	      obj.trigger('load');
	    }
	});
}