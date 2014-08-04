
define(function(require,exports){
	var Layout = require('../base/layout');  //引入布局模块
	var Tool = require('../base/tool');
	var RewardModel = Backbone.Model.extend({});
	
	var RewardCollection = Backbone.Collection.extend({
		model: RewardModel,
		localStorage: new Store('reward'),
		initialize: function(){
			this.bind('reset',this.addAll,this);
		},
		addAll: function(){
			var frag = document.createDocumentFragment();
			this.each(function(m){
				var view = new RewardView({
					model: m
				});
				view.pushFrag(frag);
			});
			C.rewardapp.oneTimePush(frag);
		}		
	});
	
	var RewardView = Backbone.View.extend({
		tagName: 'li',
		events: {
			'touchstart': 'taped',
			'touchend': 'notap'
		},
		taped: function(e){
			var obj = $(e.currentTarget);
			obj.addClass('taped');			
		},
		notap: function(e){
			var obj = $(e.currentTarget);
			obj.parent().find('li').removeClass('taped');
		},
		pushFrag: function(frag){
			var domstr = _.template($('#rewardDataTemp').html(),this.model.toJSON());
			this.$el.html(domstr);
			var c = this.$el.find('a').attr('rel');
			this.$el.addClass(c);
			$(frag).append(this.$el);
		}
	});
	
	
	
	var RewardApp = Backbone.View.extend({
		el: '#reward',
        //查询上期开奖号码
        queryFlag: "0",
		/**
		 * 初始化
		 * @memberOf NavApp
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		initialize: function(step){
			this.setStep(2).fetchReward();
			C.Config.setToolBar();
                                         
            // jfpal.navigation.setupRightButton("刷新", "v2_right_add_normal.png", function() {
            //     $('#rewardMain ul').html("");
            //     C.rewardapp.fetchReward();
            // });
		},
		/**
		 * 抓取开奖公告
		 * @name fetchReward
		 * @memberOf RewardApp 
		 */
         fetchReward: function(){
            /*
			var url = C.Config.getRewardDataUrl() + '?typeId=' + C.Config.getRewardTypes() + '&callback=C.rewardapp.handle&t=' + new Date().getTime();
			Tool.getScript(url);
            */
            var url = '';
            var postData = {
                application: C.Config.getRewardDataUrl(),
                queryFlag: this.queryFlag,
                offset: "1",
                mobileNo: context.user.mobileNo,
                lotteryId: ""
            };
            jfpal.safeAjax(url, postData, this.handle.bind(this), function() {
            	alert('reward 文件夹 all.js 87行');
            });
		},
		/**
		 * 分发数据 
		 * @memberOf RewardApp
		 * @name oneTimePush
		 * @param data{object} 抓取回来的数据
		 * @return void
		 */
		handle: function(data){
            if (data.respCode == "0000")
            {
                var c = new RewardCollection();
                c.reset(data.resultBean);
            }
            else
            {
                alert('获取数据失败，请稍后再试',function(){},'提示');
            }
		},
		/**
		 * 一次性把生成的文档片段插入dom
		 * @memberOf RewardApp
		 * @name oneTimePush 
		 * @param frag{dom} 文档碎片
		 */
		oneTimePush: function(frag){
			var self = this;
			$('#rewardMain ul').append(frag);
			_.delay(function(){
				self.$('.loading').remove();
				C.rewardMainscroll.refresh();
			},100);
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
		
	});
	
	
	return {
		initialize: function(){
			var self = this;
			Layout.initialize().renderView('#rewardTemp',2);
			//延迟500ms，保证在页面切换动画完成之后，执行业务逻辑
			_.delay(function(){
				self.buildScroll();
				C.rewardapp = new RewardApp();
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
			$('#rewardMain').height(winH - headH + 'px');
			Layout.buildScroll('rewardMain');
			return this;
		}
		
	};
});
