/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Layout = require('../base/layout'),	//引入布局模块
		Bet = require('../base/bet'),
		Tool = require('../base/tool');  //引入算法库
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('xsscbet'),
			tempBox: '#xsscBetViewTemp',
			maxbt: 49,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: function(){
				var line1 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
					line2 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
					line3 = Tool.baseBallRandom(1,10,false,false,'floor').sort();
								
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: line1,
						l2: line2,
						l3: line3
					},
					betstr: '1:-,-,' + line1[0] + ',' + line2[0] + ',' + line3[0]
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
			key: 'xssc_x3zhx',
			title: '新时时彩',
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串，如01 03 04 05 06 07:01 02:2:4&01 03 04 05 06 07:01 02:2:4
			 */
			addContinues: function(num){
				var self = this;
				self.collection.clear();
				var arr = num.split('&');
				_.each(arr,function(val){
					if(val.indexOf(':') >= 0){
						var _arr = val.split(':'),
							type = _arr[0],
							nostr = _arr[1];
						var specNo = nostr.match(/-/gi) ? nostr.match(/-/gi).length : 0;
						//直选
						if(type == '1'){
							//五星直选
							if(specNo == 0){
								self.collection.create({
									key: 'xssc_x5zhx',
									bet: 1,
									value: {
										l1: [nostr[0]],
										l2: [nostr[2]],
										l3: [nostr[4]],
										l4: [nostr[6]],
										l5: [nostr[8]],
									},
									betstr: val
								});
							}else if(specNo == 1){
								//四星直选
								self.collection.create({
									key: 'xssc_x4zhx',
									bet: 1,
									value: {
										l1: [nostr[2]],
										l2: [nostr[4]],
										l3: [nostr[6]],
										l4: [nostr[8]]
									},
									betstr: val
								});
							}else if(specNo == 2){
								//三星直选
								self.collection.create({
									key: 'xssc_x3zhx',
									bet: 1,
									value: {
										l1: [nostr[4]],
										l2: [nostr[6]],
										l3: [nostr[8]]
									},
									betstr: val
								});
							}else if(specNo == 3){
								//二星直选
								self.collection.create({
									key: 'xssc_x2zhx',
									bet: 1,
									value: {
										l1: [nostr[6]],
										l2: [nostr[8]]
									},
									betstr: val
								});
							}else if(specNo == 4){
								//一星直选
								self.collection.create({
									key: 'xssc_x1zhx',
									bet: 1,
									value: {
										l1: [nostr[8]]
									},
									betstr: val
								});
							}
						}else if(type == '5'){
							//五星通选
							self.collection.create({
								key: 'xssc_x5tx',
								bet: 1,
								value: {
									l1: [nostr[0]],
									l2: [nostr[2]],
									l3: [nostr[4]],
									l4: [nostr[6]],
									l5: [nostr[8]],
								},
								betstr: val
							});
						}else if(type == '6'){
							//三星组三
							self.collection.create({
								key: 'xssc_x3z3',
								bet: 1,
								value: {
									l1: nostr.replace('-,-,','').split(',')
								},
								betstr: val,
								canEdit: false
							});
						}else if(type == '7'){
							//三星组六
							self.collection.create({
								key: 'xssc_x3z6',
								bet: 1,
								value: {
									l1: nostr.replace('-,-,','').split(',')
								},
								betstr: val
							});
						}else if(type == '4'){
							//二星组选
							self.collection.create({
								key: 'xssc_x2zx',
								bet: 1,
								value: {
									l1: nostr.replace('-,-,-,','').split(',')
								},
								betstr: val
							});
						}
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
				Tool.detectLocalData('xsscbet',C.betcollection,location.hash,C.Config.tipDetect);
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
					self.editNow(i);
				}else{
					self.insertNewSelect();
				}
				
				C.betapp.loadSubmit();
			},delayTime);
		},
		editNow: function(index){
			//判断是否在当前hash刷新,或者直接进入当前hash
			if(typeof C.xsscx3zhxballcollection === 'undefined' || C.xsscx3zhxballcollection.verify() != true){
				return;
			}
			var betArray = C.xsscx3zhxballcollection.getBetArray();
			C.betcollection.models[index].set(betArray);
			C.betcollection.models[index].set({
				editing: false
			});
			C.betcollection.models[index].save();
			//清除选号盘集合中的数据
			
			//清除选号盘集合中的数据
			typeof C.xsscx1zhxballcollection !== 'undefined' && C.xsscx1zhxballcollection.clear();
			typeof C.xsscdxdsballcollection !== 'undefined' && C.xsscdxdsballcollection.clear();
			typeof C.xsscx2zhxballcollection !== 'undefined' && C.xsscx2zhxballcollection.clear();
			typeof C.xsscx2zxballcollection !== 'undefined' && C.xsscx2zxballcollection.clear();
			typeof C.xsscx3zhxballcollection !== 'undefined' && C.xsscx3zhxballcollection.clear();
			typeof C.xsscx3z3ballcollection !== 'undefined' && C.xsscx3z3ballcollection.clear();
			typeof C.xsscx3z6ballcollection !== 'undefined' && C.xsscx3z6ballcollection.clear();
			typeof C.xsscx4zhxballcollection !== 'undefined' && C.xsscx4zhxballcollection.clear();
			typeof C.xsscx5zhxballcollection !== 'undefined' && C.xsscx5zhxballcollection.clear();
			typeof C.xsscx5txballcollection !== 'undefined' && C.xsscx5txballcollection.clear();
		},
		/**
		 * 插入新的选号到投注列表
		 * @memberOf ssqbet
		 */
		insertNewSelect: function(){
			//判断是否在当前hash刷新,或者直接进入当前hash
			if(typeof C.xsscx3zhxballcollection !== 'undefined' && C.xsscx3zhxballcollection.verify() === true){
				//获取选号盘产生的选号对象，不区分普通、胆拖
				var betArray = C.xsscx3zhxballcollection.getBetArray();
				C.betcollection.create(betArray);
				//清除选号盘集合中的数据
				C.xsscx3zhxballcollection.clear();
			}
		}
		
	};
});