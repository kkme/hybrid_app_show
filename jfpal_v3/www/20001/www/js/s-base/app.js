
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var Tool = require('../base/tool'),
		Calculator = require('../base/calculator'),
		Layout = require('./layout'),
		Item = require('./item'),
		Filter = require('./filter'),
		PassType = require('./passType'),
		Bet = require('./bet');

	/**
	 * 对阵应用视图
	 * @class App
	 * @name App
	 */
	var AppView = Backbone.View.extend({
		el: '#main',
		events: {
			'click #btn-passType': 'setPassType',
			'click #btn-bet': 'setBet',
			'click #more': 'showMore',
			'touchstart #btn-passType': 'taped',
			'touchstart #btn-bet': 'taped',
			'touchend #btn-passType': 'untaped',
			'touchend #btn-bet': 'untaped'
		},
		initialize: function(cfg) {
			var self = this;
			//配置
			cfg = $.extend({}, cfg);
			Tool.buildCfg.call(this, cfg);

			C.Config.rightBar = function() {
				if (C.Config.hasRightBar) {
					self.setFilter(self);
				}
			};
			
			//插入初始页和投注篮
			Layout.initialize().renderView('#BetTemp', '#main', {}).renderView('#BasketTemp', '#main');

			//获取历史对阵,以lotteryTypeName为key
			var store = localStorage.getItem(C.Config.lotteryTypeName);
			//self._store = (store && JSON.parse(store)) || {};
			self._store = {};
			
			C.DataCache.on('match-change', function() {
				self.calculateMatch();
			});
			C.DataCache.on('calculate', function(e) {
				C.DataCache.betNum = Calculator.calCount(C.Config.hasRepeat, [], C.DataCache.bet.arr, C.DataCache.passType, 0, C.DataCache.bet.size);
				C.DataCache.betFee = C.DataCache.betNum * 2 * C.DataCache.bt;
				e.callback();
			});
			
			//get Data
			var url = C.Config.getMatchDataUrl() + '?callback=' + this.id + '.initMatch&lotteryTypeId=' + C.Config.lotteryTypeName + '&playType=' + C.Config.playType + '&t=' + new Date().getTime();
			Tool.getScript(url);
		},
		initMatch: function(data) {
			var self = this;
			if (data.status !== 'ok') {
				self.els = [];
				$('#loading').html(C.Config.exception[data.resultCode]).removeClass('hidden');
				return;		
			}
			if (data.results.length === 0) {
				self.els = [];
				$('#loading').html('<div class="match-empty">今日暂无对阵</div>').removeClass('hidden');
				return;
			}
			
			if (!self.collection) {
				self.collection = new Item.collection(self);
			}

			//处理数据
			var arr = [];
			_.each(data.results, function(matchList) {
				_.each(matchList.matchList, function(match) {
					if (!match.dcIsFinished) {
						match.matchsTimes = matchList.matchsTimes;
						var _store = self._store,
							_key = (C.Config.lotteryType == 16) ? (match.issueId + '' + match.matchOrder) : match.matchOrder,
							_match = _store ? _store[_key] : false,
							_win = _match ? _match.win : false,
							_even = _match ? _match.even : false,
							_negative = _match ? _match.negative : false;
						//初始化match对象
						C.DataCache.matches[match.matchOrder] = {
							matchOrder: match.matchOrder,
							gameName: match.gameName,
							win: _win,
							even: _even,
							negative: _negative,
							selectNum: Number(_win) + Number(_even) + Number(_negative)
						};
						
						//本地存储
						if (_match) {
							C.DataCache.historyMatch[_key] = _match;
						}
						arr.push(match);
					}
				});				
			});

			C.DataCache.matchList = arr;
			C.DataCache.totalPage = Math.ceil(arr.length / C.Config.unit); //分页
			
			//单场无对阵
			if (arr.length == 0) {
				self.els = [];
				$('#loading').html('<div class="match-empty">本期赛事已截止</div>').removeClass('hidden');
				return;
			}
			//避免渲染时间过长，首次渲染20条(可配置)
			self.collection.add(arr.slice(0, C.Config.unit));
		},
		/*
		 * 二态
		 */
		taped: function(e){
			var obj = $(e.currentTarget);
			obj.addClass('taped');
		},
		untaped: function(e){
			var obj = $(e.currentTarget);
			obj.removeClass('taped');
		},
		/**
		 * 插入HTML文档片段
		 * @param {node/string} frag  文档片段
		 */
		append: function(frag) {
			var self = this;
			$('#matchBox').append(frag);
			$('#loading').css({'paddingTop': '20px', 'paddingBottom': '0'}).addClass('hidden');
			
			_.delay(function() {
				//重设节点
				self.els = $('#main dl');
			}, 0);

			//是否显示更多
			if (C.DataCache.totalPage > C.DataCache.page) {
				$('#more').removeClass('hidden');
			}	
			//计算场次
			C.DataCache.trigger('match-change');
		},
		/**
		 * 显示更多对阵
		 */
		showMore: function() {
			var self = this,
				page = C.DataCache.page;				
			C.DataCache.page ++;
			$('#more').addClass('hidden');
			$('#loading').removeClass('hidden');
			_.delay(function() {
				self.collection.add(C.DataCache.matchList.slice(page * C.Config.unit, (page + 1) * C.Config.unit));
			}, 300);
		},
		/**
		 * 设置过关方式
		 */
		setPassType: function() {
			var self = this;
			if (!self.els || (self.els.length == 0)) {
				return;
			}
			if (!C.DataCache.passTypeView) {
				C.DataCache.passTypeView = new PassType.view(null, self);
			}
			var a = [], a1 = [], a2 = [], len = C.DataCache.bet.size;
			for (var i = 1; i <= len; i ++) {
				var ptArr = C.Config.passType[i];
				if (ptArr) {                  //串1置于前，串n置于后
					a1.push(ptArr[0]);
					a2 = a2.concat(ptArr.slice(1));
				}
			}
			a = a1.concat(a2);
			C.DataCache.passTypeView.model.set({'pt': a});
			C.DataCache.passTypeView.render();
			Layout.switchApp(1);
		},
		/**
		 * 筛选
		 */
		setFilter: function(self) {
			if (!self.els || (self.els.length == 0)) {
				return;
			}
			//初始化
			if (C.DataCache.filterView) {
				C.DataCache.filterView.render();
			} else {
				var obj = {};
				obj.length = 0;
				obj.game = [];
				obj.data = {};
				for (var key in C.DataCache.matches) {
					var name = C.DataCache.matches[key].gameName;						
					if (!obj.data[name]) {
						obj.game.push(name);
						obj.data[name] = {};
						obj.data[name].num = 0;
						obj.data[name].select = true;
					}
					obj.data[name].num ++;
					obj.length ++;
				}
				
				C.DataCache.filterView = new Filter.view(obj, self);
			}
			Layout.switchApp(1);
		},
		/**
		 * 投注
		 */
		setBet: function() {
			if (Bet.verify()) {
				//Layout.transBox('正在提交订单，请稍候');
                                       var d = Bet.getFormFields(this.id + '.orderCallback');
                                       var url = '';
                                       var postData = {
                                       application: C.Config.getBetUrl(),
                                       //typeId: lotType,
                                       callback: "C.betapp.handleIssue",
                                       //t: new Date().getTime()
                                       };
                                       //jfpal.safeAjax(url, postData, this.handleIssue);
				//Tool.getScript(C.Config.getBetUrl() + );
			}
		},
		/**
		 * 投注回调
		 */
		orderCallback: function(data) {
			Layout.removeTransBox();
			if (data.status == false) {
				if (data.resultCode == 'NEW_LOTTERY_USER') {
					localStorage.setItem('betfrom', location.href);
					C.Config.changeUrl('index-alipay-native-app.html#!exception/NEW_LOTTERY_USER', $('#simulateDom')[0]);
				} else if (data.resultCode === 'ERR_LOGIN') {
					jfpal.login();
					location.reload();
				} else {
					alert(C.Config.exception[data.resultCode], function(){}, '提示');
					//alert(data.resultCode, function(){}, '提示');
				}
				return;
			}
			jfpal.jfPay(
                           {
                           "merchantId": "0004000002",
                           "merchantName": '彩票',
                           "productId": '0000000000',
                           "orderAmt": data.orderAmt,
                           "orderDesc": data.resultBean.orderNo,
                           "orderRemark": "1"
                           },
                           this.payCallback, this.payCallback);
		},
		/**
		 * 支付回调
		 */
		payCallback: function(data) {
			if (data.status == 'no') {
				//alert(data.memo, function(){}, '提示');
			}
			localStorage.removeItem(C.Config.lotteryTypeName);
			location.reload();
		},
		/**
		 * 筛选回调
		 */
		filterCallBack: function() {
			try	{
				var filter = C.DataCache.filterView.model.get('data');
				_.each(this.els, function(node) {
					var k = $(node).attr('data-gameName');
					filter[k].select ? $(node).removeClass('hidden') : $(node).addClass('hidden');
				}); 
			} catch (e) {}
			this.resetBar();

			if (C.DataCache.page === C.DataCache.totalPage) {
				return;
			}

			var page = C.DataCache.page;
			C.DataCache.page = C.DataCache.totalPage;  
			$('#more').addClass('hidden');
			//$('#loading').removeClass('hidden');
			this.collection.add(C.DataCache.matchList.slice(page * C.Config.unit));
		},
		/**
		 * 设置过关方式回调
		 */
		passTypeCallBack: function() {
			$('#money').html(C.DataCache.betFee);
			this.resetBar();
		},
		/**
		 * 统计对阵
		 */
		calculateMatch: function() {
			var arr = [];
			for(var key in C.DataCache.matches) {
				var num = C.DataCache.matches[key].selectNum;
				(num > 0) && arr.push(num);
			}
			var bet = C.DataCache.bet = {
				size: arr.length,                           //比赛场次
				arr: Calculator.transArrayToNum(arr)        //统计数组
			};
			
			//过关方式为空，不计算
			if (!C.DataCache.passType) {
				return;
			} else {
				//删除过关方式中的无效选项
				arr = [];
				_.each(C.DataCache.passType, function(pt) {
					if (pt.slice(0, 1) <= bet.size) {
						arr.push(pt);				
					}
				});
				C.DataCache.passType = arr;
			}
			
			C.DataCache.trigger('calculate', {
				callback: function() {
					$('#money').html(C.DataCache.betFee);
				}
			});
		},
		/**
		 * 重设工具栏
		 */
		resetBar: function() {
			var self = this;
			Layout.switchApp(-1);
			Layout.clearView('#extra');
			if (typeof jfpal !== 'undefined') {
				jfpal.navigation.setTitle(C.Config.lotteryTypeLocalName);
				jfpal.navigation.setRightItemTitle(C.Config.hasRightBar ? '赛事筛选' : '');
			}
			C.Config.leftBar = function() {
				C.Config.changeUrl('index-alipay-native-app.html#!nav/1', $('#simulateDom')[0]);
			};
			C.Config.rightBar = function() {
				if (C.Config.hasRightBar) {
					self.setFilter(self);
				}
			};
		}
	});
		
	return {
		app: AppView
	}
});
