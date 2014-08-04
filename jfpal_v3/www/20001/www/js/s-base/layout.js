/**
 * @fileoverview  网页布局管理模块
 * @author 栋寒（zhenn）	
 * @dependencise: iscroll
 * @for: pad webapp
 */

/**
 * 声明布局模块
 */
define(function(require, exports) {
    /**
     * 返回外部调用接口
     * {
     *		init: function(){},
     *		handleLayout: function(){},
     *		buildScroll: function(){}
     * }
     */
    return {
    	wrapper: $('#wrapper'),
		main: $('#main'), 
		extra: $('#extra'), 
        initialize: function() {
			if(navigator.notification){
				window.alert = navigator.notification.alert;
				//window.confirm = navigator.notification.confirm;
			}

			this.setLayout();
            return this;
        },
        /**
         * 设置布局
         * @memberOf Layout
         */
        setLayout: function() {
            var winW = window.innerWidth,
				winH = window.innerHeight;

			this.wrapper.width(2 * winW + 'px').css('minHeight', winH + 'px');    //设置最小高度为屏幕高度
			this.main.width(winW + 'px');
			this.extra.width(winW + 'px');
			this.addStyleSheet('.loading{padding-bottom:' + (winH - 225) + 'px;}');

			//ios 5以下，hack for position:fixed
			var useragent = navigator.userAgent.toLowerCase();
			if(((C.Config.platform === 'ios') && !(/OS [5-9]_\d[_\d]* like Mac OS X/gi).test(useragent)) || ((C.Config.platform === 'android') && !(/Android (2.[3-9]|[3-9].[0-9])/gi).test(useragent))) {
			//if((C.Config.platform === 'ios') && !(/OS [5-9]_\d[_\d]* like Mac OS X/gi).test(useragent)) {
				// this.addStyleSheet('#basket{position:static;}#betBox{min-height:' + (winH - 85) + 'px;}#bet .bd{padding-bottom:0;}#extra .bd{padding-bottom:0;}#extra .bd{min-height:' + (winH - 77) + 'px;}#extra .ft{position:static;}');
			}
            return this;
        },
		/**
         * 添加样式，only for webkit
         * @memberOf Layout
         */
		addStyleSheet: function(cssText) {
            var elem;

            elem = $('<style>')[0];
            $('head')[0].appendChild(elem);

			elem.appendChild(document.createTextNode(cssText));
        },
		/**
         * 清空容器
         * @memberOf Layout
         */
		clearView: function(selector) {
			$(selector).empty();
			return this;
		},
		/**
         * 渲染js模板
         * @memberOf Layout
         */
       	renderView: function(selector, box, data) {
       		var str = $(selector).html(),
				box = $(box);
			if (data) {
				//data is array
				if (data.length) {
					var frag = document.createDocumentFragment();
					_.each(data, function(unit){
						$(frag).append(_.template(str, data));
					});
					box.append(frag);
					return this;
				}
				
				box.append(_.template(str, data));
				return this;
			}
			box.append(str);
       		return this;
       	},
		/**
		 * 切换应用界面
		 * @memberOf Layout
		 */
		switchApp: function(dir) {
			if (dir > 0) {
				//this._scrollY = window.scrollY;                //记录滚动位置，切换回对阵时重新显示该位置
				this.wrapper.addClass('right');

				//fixed元素隐藏
				$('#basket').addClass('hidden');
				$('#main .hd').addClass('hidden');
			    $('#main .bd').addClass('hidden');                //避免对阵长度影响其他页长度，先对对阵做隐藏
				$('#extra .hd').removeClass('hidden');
				$('#extra .ft').removeClass('hidden');
				//window.scrollTo(0, 0);          
			} else if (dir < 0) {
				this.wrapper.removeClass('right');
				
				//fixed元素隐藏
				$('#basket').removeClass('hidden');
				$('#main .hd').removeClass('hidden');
				$('#main .bd').removeClass('hidden');
				$('#extra .hd').addClass('hidden');
				$('#extra .ft').addClass('hidden');
				//window.scrollTo(0, this._scrollY || 0);          //滚动到切换前位置
			}
			//window.scrollTo(0, 0);    //bugfix
       		return this;		
		},
        /**
         * 构建遮罩层
         * @memberOf Laout
         */
        buildMaskLayer: function() {
			if ($('.mask').length) {
				return;
			}
            var winH = window.innerHeight,
				layer = document.createElement('div');
            layer.className = 'mask';
            layer.style.height = winH + 'px';
            this.layer = $(layer);
            $('body').css({'height': winH + 'px', 'overflow-y': 'hidden'}).append(layer);
        },
        /**
         * 构建遮罩层
         * @memberOf Laout
         */
        removeMaskLayer: function() {
			if (!this.layer) {
				return;
			}
			$('body').css({'height': 'auto', 'overflow-y': 'visiable'});
            this.layer.remove();
        },
		/**
		 * 过渡界面
		 * @memberOf BetApp 
		 */
		transBox: function(str){
			this.buildMaskLayer();
			$('body').append('<div id="wait"><p>' + str + '</p></div>');
		},
		/**
		 * 移除过渡界面
		 * @memberOf BetApp
		 * @name removeWait
		 */
		removeTransBox: function(){
			this.removeMaskLayer();
			$('#wait').remove();
		}
    };
});
