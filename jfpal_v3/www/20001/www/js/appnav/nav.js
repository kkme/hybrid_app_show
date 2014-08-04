
define(function(require,exports){
	var step;
	var Layout = require('../base/layout');  //引入布局模块
	var Tool = require('../base/tool');
	var NavApp = Backbone.View.extend({
		el: '#appnav',
		logined: false,
		events: {
			'click .myLottery a': 'showOrder',
			'touchstart li': 'taped',
			'touchend li': 'notap'
		},
		taped: function(e){
			var obj = $(e.currentTarget);
			obj.addClass('taped');
		},
		notap: function(e){
			var lis = this.$el.find('li');
			lis.removeClass('taped');
		},
		/**
		 * 初始化
		 * @memberOf NavApp
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		initialize: function(step){
			this.setStep(step);
            
		},
		/**
		 * 保存当前step到配置项
		 * @memberOf NavApp
		 * @return NavApp
		 */
		setStep: function(step){
			C.Config.step = Number(step);
			return this;
		},
		/**
		 * 获得sid
		 * @memberOf NavApp
		 * @name getSid
		 * @return sid{string} sid 
		 */
		getSid: function(){
			var obj = Tool.searchJSON(location.search);
			var sid = '';
			if(obj.sid){
				sid = obj.sid;
			}else if(Tool.getCookie('sid')){
				sid = Tool.getCookie('sid');
			}
			return sid;
		},
		/**
		 * 查看我的订单
		 * @name showOrder
		 * @memberOf NavApp 
		 */
		showOrder: function(e){
			var self = this,
				obj = $(e.currentTarget);
			var sid = this.getSid();
			C.Config.gotoOrder(obj,sid,e);
		},
        /**
         * 获取彩期数据
         * @name fetchIssue
         * @memberOf BetApp
         */
        fetchIssue: function(){
              console.log('fetchIssue in nav.js');
              var url = '';
              var postData = {
                  application: C.Config.getIssueDataUrl(),
                  mobileNo: context.user.mobileNo
                  //t: new Date().getTime()
              };
              jfpal.safeAjax(url, postData, this.handleIssue.bind(this), function() {
              	alert('appnav 文件夹 nav.js 81行');
              });
        },
        /**
         * 管理彩期数据
         * @name handleIssue
         * @memberOf BetApp
         */
        handleIssue: function(data){
                                      
            if(data.respCode == "0000"){
                if(data.resultBean.length > 0){
                    _.each(data.resultBean, function(o) {
                        var periodNo = "";
                        if (o.lotteryId === "01")
                           periodNo = "ssqPeriodNo";
                        else if (o.lotteryId === "05")
                           periodNo = "fc3dPeriodNo";
                        else if (o.lotteryId === "10")
                           periodNo = "swxwPeriodNo";
                        $("#"+periodNo).html("第" + o.periodId + "期");
                    });
                }
              }else{
                  alert('获取数据失败，请稍后再试',function(){},'提示');
                  console.log(data.respDesc);
              }
        }
	});
	
	
	return {
		initialize: function(curstep){
			step = curstep;
			var self = this;
            C.navapp = new NavApp();
            C.navapp.fetchIssue();
			Layout.initialize().renderView('#appNavTemp',curstep);
			C.Config.setToolBar();
			
			//延迟500ms，保证在页面切换动画完成之后，执行业务逻辑
			_.delay(function(){
				self.buildScroll();
//				C.navapp = new NavApp(step);
				$('#tabbar').show();
			},500);
		},
		/**
		 * 创建该页的iscroll对象
		 * @memberOf Nav
		 * @return Nav
		 */
		buildScroll: function(){
			
			var winH = window.innerHeight,
				headH = $('.header').height();
			$('#appMenu').height(winH - headH + 'px');
			$('#appMenu ul').css('minHeight',winH - headH - 20 + 'px');
//			Layout.singleScroll('appMenu',{});
			return this;
		}
		
	};
});