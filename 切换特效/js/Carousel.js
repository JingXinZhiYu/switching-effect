;(function($){
	var Carousel = function(poster){
		//保存单个旋转对象
		var _this = this;
		this.poster = poster;
		this.itemMain = poster.find("ul.poster-main");
		this.prevBtn = poster.find("div.poster-pre-pic");
		this.nextBtn = poster.find("div.poster-next-pic");
		this.posterItems = poster.find("li.poster-item");
		if(this.posterItems.size()%2 == 0){
			this.itemMain.append(this.posterItems.eq(0).clone());
			this.posterItems = this.itemMain.children();
		};
		this.firstItem = this.posterItems.first();
		this.lastItem = this.posterItems.last();
		this.rotateFlag = true;

		
		//默认配置参数
		this.setting = {
			"width":800,	//幻灯片的宽度
			"height":270,	//幻灯片的高度
			"posterWidth":640,	//幻灯片第一帧的宽度
			"posterHeight":270,	//幻灯片第一帧的高度
			"verticalAlign":"middle",
			"speed":500,
			"scale":0.9,
			"autoPlay":true,
			"delay":2000
		};
		$.extend(this.setting , this.getSetting());
		this.setSetting();
		this.setPosterPos();
		this.nextBtn.click(function(){
			if(_this.rotateFlag){
			_this.carouselRotate("left");
			_this.rotateFlag = false;
			}
		});
		this.prevBtn.click(function(){
			if(_this.rotateFlag){
			_this.carouselRotate("right");
			_this.rotateFlag = false;
			}
		});

		if(this.setting.autoPlay){
			this.autoPlay();
			this.poster.hover(function(){
				window.clearInterval(_this.timer)
			},function(){
				_this.autoPlay();
			})
		}
	}

	Carousel.prototype = {

		autoPlay : function(){
			var self = this;
			this.timer = window.setInterval(function(){
				self.nextBtn.click();
			},this.setting.delay);
		},

		setPosterPos : function(){
			var _self_ = this;
			var restPosters = this.posterItems.slice(1);
			var posterSize = this.posterItems.size()/2;
			var rightPosters = restPosters.slice(0,posterSize);
			var leftPosters = restPosters.slice(posterSize,posterSize*2);
			var rw  = this.setting.posterWidth;
			var rh = this.setting.posterHeight;
			var h = rh;
			var proportion = this.setting.scale;
			var level = Math.floor(this.posterItems.size()/2);
			var firstLeft = (this.setting.width-this.setting.posterWidth)/2;
			var gap = (firstLeft)/level;
			var fixOffetLeft = firstLeft + rw;

				
			rightPosters.each(function(i){
				level--;
				rw = rw*proportion;
				rh = rh*proportion;
				var j = i;
				$(this).css({
					width : rw,
					height : rh,
					 left : fixOffetLeft+(++j)*gap - rw,
					  top : _self_.setVerticalAlign(rh),
					 opacity : 1/(++i),
					 zIndex : level
				});
			});
			var lw = rightPosters.last().width();
			var lh = rightPosters.last().height();
			var oloop = Math.floor(this.posterItems.size()/2);
			leftPosters.each(function(i){
				
				$(this).css({
					width : lw,
					height : lh,
					 left : i*gap,
					  top : _self_.setVerticalAlign(lh),
					 opacity : 1/oloop,
					 zIndex : level
				});
				lw = lw/_self_.setting.scale;
				lh = lh/_self_.setting.scale;
				oloop--;
				level++;
			})

		},

		setSetting : function(){
			this.poster.css({
				width : this.setting.width,
				height : this.setting.height
			});
			this.itemMain.css({
				width : this.setting.width,
				height : this.setting.height
			});
			//计算按钮区域的宽度
			var w = (this.setting.width - this.setting.posterWidth)/2;
			this.prevBtn.css({
				width : w,
				height : this.setting.height,
				zIndex : Math.ceil(this.posterItems.size()/2)
			});
			this.nextBtn.css({
				width : w,
				height : this.setting.height,
				zIndex : Math.ceil(this.posterItems.size()/2)
			});
			this.firstItem.css({
				width : this.setting.posterWidth,
				height : this.setting.posterHeight,
				left : w,
				zIndex : Math.floor(this.posterItems.size()/2)
			});
		},
 		
 		getSetting : function(){
 			var setting = this.poster.attr("data-setting");
 			if(setting&&setting!=""){
 				return $.parseJSON(setting);
 			}else{
 				return {};
 			}
 		},

 		setVerticalAlign : function(height){
 			var verticalType = this.setting.verticalAlign;
 			var top = 0 ;
 			if(verticalType == "middle"){
 				top = (this.setting.height-height)/2;
 			}else if(verticalType == "bottom"){
 				top = this.setting.height-height;
 			}
 			return top;
 		},

 		carouselRotate : function(direction){
 			var _this_ = this;

 			if(direction === "left"){
 				
 				this.posterItems.each(function(){

 					var self = $(this),
 					prev = self.prev()[0]?self.prev():_this_.lastItem,
 					width = prev.width(),
 					height = prev.height(),
 					top = prev.css("top"),
 					left = prev.css("left"),
 					opacity = prev.css("opacity"),
 					zIndex = prev.css("zIndex");

 					self.animate({
 						width : width,
						height : height,
						left : left,
					  	top : top,
					 	opacity : opacity,
					 	zIndex : zIndex
 					},_this_.setting.speed,function(){
 						_this_.rotateFlag = true;
 					});

 				});
 			}else if(direction === "right"){

 				this.posterItems.each(function(){

 					var self = $(this),
 					next = self.next()[0]?self.next():_this_.firstItem,
 					width = next.width(),
 					height = next.height(),
 					top = next.css("top"),
 					left = next.css("left"),
 					opacity = next.css("opacity"),
 					zIndex = next.css("zIndex");

 					self.animate({
 						width : width,
						height : height,
						left : left,
					  	top : top,
					 	opacity : opacity,
					 	zIndex : zIndex
 					},_this_.setting.speed,function(){
 						_this_.rotateFlag = true;
 					});

 				});
 			};
 		}
	}
	Carousel.init = function(posters){
		var _this_ = this;
		posters.each(function(){
			new _this_($(this));
		})
	}
	window["Carousel"] = Carousel;
})(jQuery)