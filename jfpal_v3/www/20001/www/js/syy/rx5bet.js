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
				var reds = Tool.baseBallRandom(5,11,false,true,'ceil').sort();
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: reds
					},
					betstr: reds.join(' ') + ':105'
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
			key: 'syy_rx5',
			title: '十一运夺金',
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串
			 */
			addContinues: function(num){
				var self = this;
				self.collection.clear();
				var arr = num.split('&');
				_.each(arr,function(n){
					var _arr = n.split(':');
					var str = _arr[0];
					switch(_arr[1]){
						//任选二
						case '102':
							self.collection.create({
								key: 'syy_rx2',
								bet: Tool.numC(str.split(' ').length,2),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选三
						case '103':
							self.collection.create({
								key: 'syy_rx3',
								bet: Tool.numC(str.split(' ').length,3),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选四
						case '104':
							self.collection.create({
								key: 'syy_rx4',
								bet: Tool.numC(str.split(' ').length,4),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选五
						case '105':
							self.collection.create({
								key: 'syy_rx5',
								bet: Tool.numC(str.split(' ').length,5),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选六
						case '106':
							self.collection.create({
								key: 'syy_rx6',
								bet: Tool.numC(str.split(' ').length,6),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选七
						case '107':
							self.collection.create({
								key: 'syy_rx7',
								bet: Tool.numC(str.split(' ').length,7),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选八
						case '117':
							self.collection.create({
								key: 'syy_rx8',
								bet: Tool.numC(str.split(' ').length,8),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//前一
						case '101':
							self.collection.create({
								key: 'syy_q1',
								bet: str.split(' ').length,
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//前二直选
						case '142':
							self.collection.create({
								key: 'syy_q2zhx',
								bet: str.split('|')[0].split(' ').length * str.split('|')[1].split(' ').length,
								value: {
									l1: str.split('|')[0].split(' '),
									l2: str.split('|')[1].split(' ')
								},
								betstr: n
							});
							break;
						//前二组选
						case '108':
							self.collection.create({
								key: 'syy_q2zx',
								bet: Tool.numC(str.split(' ').length,2),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//前三直选
						case '162':
							self.collection.create({
								key: 'syy_q3zhx',
								bet: str.split('|')[0].split(' ').length * str.split('|')[1].split(' ').length * str.split('|')[2].split(' ').length,
								value: {
									l1: str.split('|')[0].split(' '),
									l2: str.split('|')[1].split(' '),
									l3: str.split('|')[2].split(' ')
								},
								betstr: n
							});
							break;
						//前三组选
						case '109':
							self.collection.create({
								key: 'syy_q3zx',
								bet: Tool.numC(str.split(' ').length,3),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						default:
							break;
					}
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
			if(typeof C.syyrx5ballcollection === 'undefined' || C.syyrx5ballcollection.verify() != true){
				return;
			}
			var betArray = C.syyrx5ballcollection.getBetArray();
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
			if(typeof C.syyrx5ballcollection !== 'undefined' && C.syyrx5ballcollection.verify() === true){
				//获取选号盘产生的选号对象，不区分普通、胆拖
				var betArray = C.syyrx5ballcollection.getBetArray();
				C.betcollection.create(betArray);
				//清除选号盘集合中的数据
				C.syyrx5ballcollection.clear();
			}
		}
		
	};
});
