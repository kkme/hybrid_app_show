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
     * 引入依赖模块
     */
    var iscroll = require('../lib/iscroll'); //引入iscroll4库

    /**
     * 返回外部调用接口
     * {
     *		init: function(){},
     *		handleLayout: function(){},
     *		buildScroll: function(){}
     * }
     */
    return {
    	doc: $('#doc'),
    	wrapper: $('#wrapper'),
        initialize: function() {
            this.handleLayout();
            return this;
        },
        /**
         * 管理布局
         * @memberOf Layout
         */
        handleLayout: function() {
            var self = this;
            var winH = window.innerHeight,
            	winW = window.innerWidth;
            this.doc.height('2000px');
            window.scrollTo(0,0);
            _.delay(function(){
            	var winH = window.innerHeight;
            	self.doc.width(winW + 'px').height(winH + 'px');
            	self.wrapper.width(2 * winW + 'px');
            },100);
            return self;
        },
        setBetRegion: function(){
        	var winH = window.innerHeight,
				headH = $('.header').height();
			$('#betScroll').height(winH - headH + 'px');
			$('#shakeSelect').height(( winH - headH - 53 - 54 - 8 - 8 ) + 'px');
			return this;
        },
        /**
         * 批量创建滚动对象
         * @memberOf Layout
         */
        buildScroll: function() {
            _.each(arguments, function(n) {
                C[n+'scroll'] && C[n+'scroll'].destroy();
                C[n + 'scroll'] = new iscroll.iScroll(n, {
                	hideScrollbar: true
                });
            });
            return this;
        },
        /**
         * 单独创建滚动对象，可传配置项
         * @name singleScroll
         * @memberOf Layout
         */
        singleScroll: function(id,cfg){
        	C[id+'scroll'] && C[id+'scroll'].destroy();
        	C[id+'scroll'] = new iscroll.iScroll(id,cfg);
        },
        /**
         * 构建AbacusScroll
         * @name buildAbacusScroll
         * @memberOf Layout
         * @return Layout
         */
        doAbacusScroll: function(){
        	var winH = window.innerHeight,
				headH = $('.header').height(),
				playType = $('#selPlayType').height(),
				botTool = $('#botTool').height();
			var tarh = winH - headH -playType - botTool;
			$('#Abacus').height(tarh + 'px');
			$('#Abacus .box').css('minHeight',tarh - 20 + 'px');
//			this.singleScroll('Abacus',{
//				hideScrollbar: true
//			});
			return this;
        },
        /**
         * 构建typeListScroll
         * @param initx{number} 初始化滚动位置
         * @name doTypeListScroll
         * @memberOf Layout
         * @return Layout
         */
        doTypeListScroll: function(initx){
        	$('#typeList ul').width(70 * $('#typeList ul li').length);
//			this.singleScroll('typeList',{
//				//隐藏水平方向滚动条
//				hScrollbar: false,
//				onScrollEnd: function(){
//					if(this.x == this.maxScrollX){
//						$('.more').eq(0).addClass('hidden');
//					}else{
//						$('.more').eq(0).removeClass('hidden');
//					}
//				},
//				hideScrollbar: true,
//				x: initx
//				
//			});
			return this;
        },
        /**
         * 渲染js模板
         * @memberOf Layout
         */
       	renderView: function(selector,step){
       		var str = $(selector).html(),
       			dir = this.getAnimDir(step);
       		//debugger;
       		if(dir == 'back'){
                
       			this.wrapper.find('section').eq(0).before(str);
       		}else{
       			this.wrapper.append(str);
       		}
       		
       		$('#tabbar').hide();
       		this.switchApp(step);
       		_.delay(function(){
       			$('.submitBtn').removeClass('hidden');
       		},500);
       		return this;
       	},
       	/**
       	 * 获取动画的运动方向
       	 * @memberOf Layout
       	 * @return dir{string}  note:'back' or 'forward'
       	 */
       	getAnimDir: function(curStep){
       		var dir = '';
 			if(curStep >= C.Config.step){
 				dir = 'forward';
 			}else{
 				dir = 'back';
 			}
 			return dir;
       	},
		/**
		 * 切换应用界面
		 * @memberOf Layout
		 */
		switchApp: function(curStep){
			var self = this,
				secs = self.wrapper.children('section'),
				dir = self.getAnimDir(curStep);
			//配置切换appUI时是否需要slide动画，默认false，如需要添加anim，需要在URL中配置参数，如 http://hostname/xx.php?switchAnim=true ，安卓系统transition动画性能较差，建议屏蔽
    		var plat = C.Config.platform;
    		if(plat === 'ios'){
    			var s = 'true';
    		}else{
    			var s = 'false';
    		}
    		var switchAnim = C.Template.searchJSON(location.search).switchAnim || s; 
			if(secs.length === 2){
				//如果不允许动画
				if(switchAnim === 'false'){
					if(dir == 'forward'){
						_.delay(function(){
							secs.eq(0).remove();
						},200);
					}else if(dir === 'back'){
						_.delay(function(){
							secs.eq(1).remove();
						},200);
					}
				}else{
					for(var i in C){
						if(/scroll$/gi.test(i)){
							C[i].destroy();	
						}	
					}
					if(dir == 'forward'){
						self.wrapper.addClass('right');
						_.delay(function(){
							secs.eq(0).remove();
							self.wrapper.removeClass('anim right');
							_.delay(function(){
								self.wrapper.addClass('anim');
							},100);
						},400);
					}else if(dir == 'back'){
						self.wrapper.removeClass('anim').addClass('right');
						_.delay(function(){
							self.wrapper.addClass('anim');
							self.wrapper.removeClass('right');
						},100);
						_.delay(function(){
							secs.eq(1).remove();
						},100);
					}
				}
			}
						
		},
        /**
         * 构建遮罩层
         * @memberOf Laout
         */
        buildMaskLayer: function() {
            var layer = document.createElement('div');
            layer.className = 'mask';
            //layer.style.height = window.innerHeight + 'px';
            this.layer = $(layer);
            $('body').append(layer);
        },
        /**
         * 构建遮罩层
         * @memberOf Laout
         */
        removeMaskLayer: function() {
			if(!this.layer) return;
            this.layer.remove();
        }


    };
});
