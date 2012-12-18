var LightBox = function(){
	var display_type = 'fixed';
	var close_btn, next_btn, prev_btn, slider, lightbox, box, footer, play_btn, play_timer;
	var imgData, thumbData, index;
	var body_scroll_top, main_container;
	var play_duration = 5000;
	var markup = '\
		<div class="light_box">\
			<div class="bg"></div>\
			<div class="box"></div>\
			<div class="note">\
				<div style="width: 300px; line-height: 24px; float: left;"><div class="icon-question-sign icon-white" style="margin: 3px 5px; float: left;"></div><div style="float: left;">滑鼠拖戈圖片可調整顯示位置</div></div>\
				<div style="width: 300px; line-height: 24px; float: left;"><div class="icon-question-sign icon-white" style="margin: 3px 5px; float: left;"></div><div style="float: left;">按ESC鍵離開全螢幕顯示</div></div>\
			</div>\
			<div class="footer">\
				<div class="bg"></div>\
				<div class="slider"></div>\
				<div class="play_timer"></div>\
			</div>\
			<div class="play_btn lb_btn" title="自動播放"></div>\
			<div class="type_btn lb_btn" title="填滿\/顯示全部"></div>\
			<div class="next_btn lb_btn" title="下一張"></div>\
			<div class="prev_btn lb_btn" title="上一張"></div>\
			<div class="close_btn lb_btn" title="關閉全螢幕"></div>\
		</div>\
	';
	
	var thumb = '\
		{{each images}}\
		<div class="thumb">\
			<img src="${$value}" />\
			<div class="border"></div>\
		</div>\
		{{/each}}\
	';
	
	var init = function(){
		lightbox = $(markup);
		if($(".light_box").length) return;
		
		$(document.body).append(lightbox);
		var lb = lightbox = $('.light_box');
		
		close_btn = lb.find('.close_btn');
		next_btn = lb.find('.next_btn');
		prev_btn = lb.find('.prev_btn');
		slider = lb.find('.slider');
		box = lb.find('.box');
		footer = lb.find('.footer');
		
		
		$.template( "lb_thumb", thumb );
		
		$('.light_box .close_btn').live('click', function(){
			hide();
		}).live('mouseenter', function(){
			$(this).animate({
				backgroundPosition: "0 -42px"
			}, 500 , function(){
				$(this).css("backgroundPosition", "");
			});
		});
		
		$('.light_box .play_btn').live('click', function(){
			
			if($(this).is('.active')){
				stopPlay();
			}else{
				autoPlay();	
			}
		});
		
		$('.light_box .type_btn').live('click', function(){
			if(display_type == "fixed"){
				display_type = "";
				$(this).addClass('active');
			}else{
				display_type = "fixed";
				$(this).removeClass('active');	
			}
			
			box.find('img').resizeToParent({fadeIn: 500, zoom: 'drag', type: display_type});
		});
		
		$('.slider .thumb:not(".active")').live('click', function(){
			
			var idx = slider.find('.thumb').index($(this));
			
			var offl = $(this).offset().left;
			var rborder = footer.width() - $(this).width()*2;
			var lborder = $(this).width() + 10;
			
			if(offl > rborder && slider.find('.thumb:eq(' + (idx+1) + ')').length){
				
				slider.stop(true).animate({
					marginLeft: -offl + "px"
				}, 500);
			}
			else if(offl < lborder && slider.find('.thumb:eq(' + (idx-1) + ')').length && idx >= 0) {
				
				slider.stop(true).animate({
					marginLeft: ParseCssNumber(slider.css("marginLeft")) + footer.width()/2 + "px"
				}, 500);
			}
			
			if($('.light_box .play_btn').is('.active')){
				stopPlay();
			}
			
			setCurrentSlide(idx);
		});
		
		$('.light_box').find('.next_btn:not(".active"), .prev_btn:not(".active")').live('mouseenter', function(){
			var pos = ($(this).is('.next_btn'))? "42px 0" : "-42px 0";
			  
			$(this).stop(true, true).animate({
				backgroundPosition: pos
			}, 500 , function(){
				$(this).css("backgroundPosition", "");
			});
			
			if($('.light_box .play_btn').is('.active')){
				stopPlay();
			}
		}).live('click', function(){
			var idx = ($(this).is('.next_btn'))? index+1 : index-1;
			slider.find('.thumb:eq(' + idx + ')').click();
		});
		
		// $(".lb_btn").each(function(){
			// $(this).tooltip({title: $(this).attr("title")});
		// });		
		$(window).resize(lbResize);
	};
	
	var autoPlay = function(){
		$('.light_box .play_btn').addClass('active')
		$('.light_box .play_timer').animate({width: lightbox.width()}, play_duration, 'linear', function(){
			$(this).animate({width: 0}, 300, function(){
				index = (index < imgData.length-1)? index+1 : 0;
				slider.find('.thumb').eq(index).click();
				autoPlay();
			});
		});
	};
	
	var stopPlay = function(){
		$('.light_box .play_btn.active').removeClass('active')
		$('.light_box .play_timer').stop(true).animate({width: 0}, 300);
	};
	
	var lbResize = function(){
		box.find('img').resizeToParent({fadeIn: 500, zoom: 'drag', type: display_type});
	};
	
	var show = function(options){
		var img = options.images, idx = options.index, thumb = options.thumbs;
		if(typeof(img) == 'undefined' ) return;
		
		if(typeof(lightbox) == 'undefined'){
			init();
		}
		
		imgData = img;
		thumbData = thumb || null; 
		
		
		slider.empty().width('auto');
		$.tmpl( "lb_thumb", {images: thumb || img}).appendTo( slider );
		
		slider.width((slider.find('.thumb:first').width() + 2) * img.length);
		slider.find('.thumb img').resizeToParent();
		slider.css('marginLeft', ((slider.width() < footer.width())? -slider.width()/2 : -footer.width()/2) + "px");		
		$(document.body).addClass('lock');
		
		$(document).keyup(function(e) {
			
			if ( e.keyCode == 27) {
				hide();
			}
		});
		
		
		lightbox.show();
		setCurrentSlide(idx || 0);
		
	};
	
	var setCurrentSlide = function(idx){
		index = idx;
		if(idx == 0){
			prev_btn.addClass('active');
			next_btn.removeClass('active');
		}
		else if(idx == imgData.length-1){
			next_btn.addClass('active');
			prev_btn.removeClass('active');
		}
		else{
			next_btn.removeClass('active');
			prev_btn.removeClass('active');
		}
		
		slider.find('.thumb.active').removeClass('active');
		slider.find('.thumb:eq("' + idx +'")').addClass('active');
		
		box.find('img').css('position', 'fixed').fadeOut(200, function(){
			$(this).remove();
		});
		
		var img = $('<img src="' + imgData[idx] + '" />').hide();
		box.append(img);
		
		img.resizeToParent({fadeIn: 500, zoom: 'drag', type: display_type});
	};
	
	var nextSlide = function(){
		if(index < imgData.length-1) index++;
		$(box).empty().append();
	};
	
	var hide = function(){
		// console.log(body_scroll_top);
		// main_container.removeClass('lock')
		// $(window).scrollTo(body_scroll_top, 0);		stopPlay();
		
		$(document.body).removeClass('lock');
		
		$(document).unbind('keypress');
		box.empty();
		lightbox.hide();
	};
	
	return {
		show: show
		,hide: hide
	};
}();
