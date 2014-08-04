/**
 * @author yang zhenn
 */


define(function(require,exports){
	var Layout = require('../base/layout'),	//引入布局模块
		Bet = require('../base/bet'),
		Tool = require('../base/tool');  //引入算法库
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('fc3dbet'),
			tempBox: '#fc3dBetViewTemp',
			maxbt: 99,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: function(){
				var b = Tool.baseBallRandom(1,9,true,false,'ceil').sort(),
					s = Tool.baseBallRandom(1,9,true,false,'ceil').sort(),
					g = Tool.baseBallRandom(1,9,true,false,'ceil').sort();
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: b,
						l2: s,
						l3: g
					},
					betstr: b.toString() + s.toString() + g.toString() + ':0'
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
					arr.push(model.get('betstr') + '#' + model.get('bet'));
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
			key: 'fc3d_zhx',
			title: '福彩3D',
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串，如01 03 04 05 06 07:01 02:2:4&01 03 04 05 06 07:01 02:2:4
			 */
			addContinues: function(num){
				var self = this;
				self.collection.clear();
				var arr = num.split('&');
				_.each(arr,function(val){
					var _arr = val.split(':');
					
					var t = _arr[1];
					if(t === '0'){
						var n = _arr[0].split('');
						//直选
						self.collection.create({
							key: 'fc3d_zhx',
							bet: 1,
							value: {
								l1: n[0].split(''),
								l2: n[1].split(''),
								l3: n[2].split('')
							},
							betstr: val
						});
					}else if(t === '1'){
						//组三
						self.collection.create({
							key: 'fc3d_z3',
							bet: 1,
							value: {
								l1: _arr[0].split('')
							},
							betstr: val
						});
					}else if(t === '2'){
						//组六
						self.collection.create({
							key: 'fc3d_z6',
							bet: 1,
							value: {
								l1: _arr[0].split('')
							},
							betstr: val
						});
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
				Tool.detectLocalData('fc3dbet',C.betcollection,C.Config.betHashMap['fc3d'],C.Config.tipDetect);
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
			if(typeof C.fc3dzhxballcollection === 'undefined' || C.fc3dzhxballcollection.verify() != true){
				return;
			}
			var betArray = C.fc3dzhxballcollection.getBetArray();
			_.each(betArray,function(n,i){
				if(i === 0){
					C.betcollection.models[index].set(n);
					C.betcollection.models[index].set({
						editing: false
					});
					C.betcollection.models[index].save();
				}else{
					C.betcollection.create(n);
				}
			});
			
			//清除选号盘集合中的数据
			typeof C.fc3dz3ballcollection !== 'undefined' && C.fc3dz3ballcollection.clear();
			typeof C.fc3dzhxballcollection !== 'undefined' && C.fc3dzhxballcollection.clear();
			typeof C.fc3dz6ballcollection !== 'undefined' && C.fc3dz6ballcollection.clear();
		},
		/**
		 * 插入新的选号到投注列表
		 * @memberOf ssqbet
		 */
		insertNewSelect: function(){
			if(typeof C.fc3dzhxballcollection !== 'undefined' && C.fc3dzhxballcollection.verify() === true){
				//获取选号盘产生的选号对象，不区分普通、胆拖
				var betArray = C.fc3dzhxballcollection.getBetArray();
				_.each(betArray,function(n){
					C.betcollection.create(n);
				});
				//清除选号盘集合中的数据
				C.fc3dzhxballcollection.clear();
			}else if(typeof C.fc3dzhxhzballcollection !== 'undefined' && C.fc3dzhxhzballcollection.verify() === true){
				//获取选号盘产生的选号对象，不区分普通、胆拖
				var betArray = C.fc3dzhxhzballcollection.getBetArray();
				_.each(betArray,function(n){
					C.betcollection.create(n);
				});
				//清除选号盘集合中的数据
				C.fc3dzhxhzballcollection.clear();
			}
		}
		
	};
});