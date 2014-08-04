/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Layout = require('../base/layout'),	//引入布局模块
		Bet = require('../base/bet'),
		Tool = require('../base/tool');  //引入算法库
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('syybet'),
			tempBox: '#syyBetViewTemp',
			maxbt: 99,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: function(){
				var reds = Tool.baseBallRandom(7,11,false,true,'ceil').sort();
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: reds
					},
					betstr: reds.join(' ') + ':107'
				};
				this.create(result);
			},
			/**
			 * 获取投注投注字符串
			 * @name getNumberString
			 * @memberOf BetCollection
			 * @return 
			 */
			getNumberString: function(){
				var arr = [];
				this.each(function(model){
					//如果是创建collection实例时，传进来的model，忽略之
					if(model.get('tempBox')) return;
					arr.push(model.get('betstr'));
				});
				return arr.join('&');
			}
		};
	};
	
	
	var appConfig = function(step,collection){
		return $.extend({
			step: step
		},{
			el: '#betBasket',
			collection: collection,
			key: 'syy_rx7',
			title: '十一运夺金',
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串，如01 03 04 05 06 07:01 02:2:4&01 03 04 05 06 07:01 02:2:4
			 */
			addContinues: function(num){
				var self = this;
				//胆拖号码,直接返回
				if(num.indexOf(':') > 0){
					return;
				}
				var arr = num.split('&');
				_.each(arr,function(val){
					var _arr = val.split(' ');
					var bets = Tool.numC(_arr.length,5);
					self.collection.create({
						key: C.Config.key,
						bet: bets,
						value: {
							l1: _arr,
						},
						betstr: val
					});
					
				});
			
				
			}
		});
	};
	

	return {
		initialize: function(step){
			var self = this;
			Layout.initialize().renderView('#betBasketTemp',step);
			//延迟500ms，保证在页面切换动画完成之后，执行业务逻辑
			var delayTime = 0,
				pf = C.Config.platform;
			if(pf === 'ios'){
				delayTime = 500;
			}
			_.delay(function(){
				C.betcollection = new Bet.Collection(collectionConfig());
				//以下是业务逻辑
				C.betapp = new Bet.App(appConfig(step,C.betcollection));
				Tool.detectLocalData('syybet',C.betcollection,location.hash,C.Config.tipDetect);
				C.betapp.continueBuy();

				var hasEdit = false;
				for(var i=C.betcollection.models.length;i--;){
					if(C.betcollection.models[i].get('editing') === true){
						hasEdit = true;
						var _index = i;
						break;
					}
				}
				if(hasEdit){
					self.editNow(_index);
				}else{
					self.insertNewSelect();
				}
			
				C.betapp.loadSubmit();
			},delayTime);
		},
		editNow: function(index){
			//判断是否在当前hash刷新,或者直接进入当前hash
			if(typeof C.syyrx7ballcollection === 'undefined' || C.syyrx7ballcollection.verify() != true){
				return;
			}
			var betArray = C.syyrx7ballcollection.getBetArray();
			C.betcollection.models[index].set(betArray);
			C.betcollection.models[index].set({
				editing: false
			});
			C.betcollection.models[index].save();
			//清除选号盘集合中的数据
			
			//清除选号盘集合中的数据
			typeof C.syyrx2ballcollection !== 'undefined' && C.syyrx2ballcollection.clear();
			typeof C.syyrx3ballcollection !== 'undefined' && C.syyrx3ballcollection.clear();
			typeof C.syyrx4ballcollection !== 'undefined' && C.syyrx4ballcollection.clear();
			typeof C.syyrx5ballcollection !== 'undefined' && C.syyrx5ballcollection.clear();
			typeof C.syyrx6ballcollection !== 'undefined' && C.syyrx6ballcollection.clear();
			typeof C.syyrx7ballcollection !== 'undefined' && C.syyrx7ballcollection.clear();
			typeof C.syyrx8ballcollection !== 'undefined' && C.syyrx8ballcollection.clear();
			typeof C.syyq1ballcollection !== 'undefined' && C.syyq1ballcollection.clear();
			typeof C.syyq2zhxballcollection !== 'undefined' && C.syyq2zhxballcollection.clear();
			typeof C.syyq2zxballcollection !== 'undefined' && C.syyq2zxballcollection.clear();
			typeof C.syyq3zhxballcollection !== 'undefined' && C.syyq3zhxballcollection.clear();
			typeof C.syyq3zxballcollection !== 'undefined' && C.syyq3zxballcollection.clear();
		},
		/**
		 * 插入新的选号到投注列表
		 * @memberOf ssqbet
		 */
		insertNewSelect: function(){
			//判断是否在当前hash刷新,或者直接进入当前hash
			if(typeof C.syyrx7ballcollection !== 'undefined' && C.syyrx7ballcollection.verify() === true){
				//获取选号盘产生的选号对象，不区分普通、胆拖
				var betArray = C.syyrx7ballcollection.getBetArray();
				C.betcollection.create(betArray);
				//清除选号盘集合中的数据
				C.syyrx7ballcollection.clear();
			}
		}
		
	};
});