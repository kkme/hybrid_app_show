
define(function(require,exports){
	var Layout = require('../base/layout');  //引入布局模块
	var Tool = require('../base/tool');
	
	var Model = Backbone.Model.extend({});
	
	var ListCollection = Backbone.Collection.extend({
		model: Model,
		localStorage: new Store('rewardList'),
		initialize: function(){
			this.bind('add',this.addOne,this);
		},
		addOne: function(model){
			var view = new RewardView({
				model: model
			});
			view.render();
		}		
	});
	
	var RewardView = Backbone.View.extend({
		tagName: 'li',
		render: function(){
			var domstr = _.template($('#rewardDataListTemp').html(),this.model.toJSON());
			this.$el.html(domstr);
			$('#rewardListMain ul').append(this.$el);
			C.rewardListMainscroll.refresh();	
		}
	});
	
	var ListApp = Backbone.View.extend({
		el: '#rewardList',
		//默认拉取第一页
		page: 1,
		//默认一页10条数据
		pageSize: 10,
		//已经拉取的次数
		_exsit: 1,
        //查询历史开奖号码-list
        queryFlag: "1",
		events: {
			'click .getMore' : 'getMore'
		},
		getMore: function(){
			if(this._exsit++ >= 10){
				this.$('.getMore').html('无法获取更多开奖数据...');
				return;
			}
			this.$('.getMore').addClass('hidden');
			this.$('.load').removeClass('hidden');
			this.fetchList();
		},
		/**
		 * 初始化
		 * @memberOf NavApp
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		initialize: function(type,step){
			this.type = type;
			this.setStep(step).setTitle(type);
			C.Config.setToolBar();
			this.setRLRightBar(type).fetchList(type);
			this.buildPullRefresh();
		},
		/**
		 * 创建该页的iscroll对象
		 * @memberOf ListApp
		 * @name buildPullRefresh
		 * @return void
		 */
		buildPullRefresh: function(){
			var winH = window.innerHeight,
				headH = $('.header').height();
			var self = this;
			this.tip = this.$('.tip');
			this.g = this.$('.tip s');
			this.s = this.$('.tip span');
			$('#rewardListMain').height(winH - headH + 'px');
			$('#rewardListMain ul').css('minHeight',winH - headH - 40 + 'px');
//			Layout.singleScroll('rewardListMain',{
//				hideScrollbar: true
//			});
			return this;
		},
		/**
		 * 设置标题
		 * @memberOf ListApp
		 * @name setTitle
		 * @return ListApp
		 */
		setTitle: function(type){
			var t = '';
			for(var i in C.Config.lotTypeNumberId){
				if(type == C.Config.lotTypeNumberId[i]){
					t = i;
				}
			}
			this.$('.header h2').html(C.Config.lotteryTypeHash[t]);
			return this;
		},
		/**
		 * 设置开奖公告列表右侧按钮状态(显示以否、超链接)
		 */
		setRLRightBar: function(type){
			if(!C.Config.setRLRightBar){
				if(_.indexOf(C.Config.doneLot,Number(type)) >= 0){
					this.$('.type').removeClass('hidden');
				}
				var t = '', _hash = '';
				for(var i in C.Config.lotTypeNumberId){
					if(type == C.Config.lotTypeNumberId[i]){
						t = i;
					}
				}
				for(var j in C.Config.abacusBetMap){
					if(j.indexOf(t) === 0){
						_hash = C.Config.abacusBetMap[j];
					}
				}
				this.$('.type').attr('href',_hash);
				
			}else{
				C.Config.setRLRightBar(type);
			}
			
			return this;
		},
		/**
		 * 获取更多开奖数据
		 * @name getMoreData
		 * @memberOf ListApp
		 */
		getMoreData: function(){
			var self = this;
			var isBottom = C.rewardListMainscroll.y <= C.rewardListMainscroll.maxScrollY - 60 ? true : false;
			_.delay(function(){
				if(isBottom){
					self.fetchList();						
				}
			},100);
		},
		/**
		 * 抓取开奖公告数据
		 * @name fetchReward
		 * @memberOf ListApp 
		 */
		fetchList: function(){
                                       /*
			var url = C.Config.getRewardDataListUrl() + '?typeId=' + this.type + '&callback=C.listapp.handle&t=' + new Date().getTime() + '&page=' + this.page + '&pageSize=' + this.pageSize;
			Tool.getScript(url);*/
            var url = '';
            var offset = this.page * this.pageSize - 9;
            var postData = {
                application: C.Config.getRewardDataUrl(),
                lotteryId: this.type.toString(),
                queryFlag: this.queryFlag.toString(),
                offset: offset.toString(),
                mobileNo: jfpal.user.mobileNo
            };
            jfpal.safeAjax(url, postData, this.handle.bind(this), function() {
            	alert('reward 文件夹 list.js 162行')
            });
		},
		/**
		 * 分发数据 
		 * @memberOf ListApp
		 * @name oneTimePush
		 * @param data{object} 抓取回来的数据
		 * @return void
		 */
		handle: function(data){
			this.page ++;
			var self = this;
			if(data.respCode == "0000"){
                var c = new ListCollection();
//                _.each(data.resultBean,function(n){
//                       n.lotteryCode = self.type;
//                });
                _.each(data.resultBean,function(m){
                    c.create(m);
                });
                // 最后一批数据
                if (data.summary.isLast == "1")
                {
                   this._exsit = 10;
                }
                _.delay(function(){
                    self.$('.getMore').removeClass('hidden');
                    self.$('.load').addClass('hidden');
                    C.rewardListMainscroll.refresh();
                },100);
			}else{
				alert('获取数据失败，请稍后再试',function(){},'提示');
			}
		},
		/**
		 * 保存当前step到配置项
		 * @memberOf ListApp
		 * @return ListApp
		 */
		setStep: function(step){
			C.Config.step = Number(step);
			return this;
		},
		
	});
	
	return {
		initialize: function(type){
			var self = this;
			Layout.initialize().renderView('#rewardListTemp',3);
			//延迟500ms，保证在页面切换动画完成之后，执行业务逻辑
			_.delay(function(){
				C.listapp = new ListApp(type,3);
			},500);
			
		}
	};
});