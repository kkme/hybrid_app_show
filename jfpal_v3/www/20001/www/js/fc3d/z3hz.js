/**
 * @author yang zhenn
 */


define(function(require,exports){
	var Tool = require('../base/tool'), 	//引入算法库
		Layout = require('../base/layout'),  //引入布局模块
		Ball = require('../base/ball'); //引入选号盘模块
		
	var collectionConfig = function(){
		return {
			lines: 1,
			key: 'fc3d_z3hz',
			localStorage: new Store('fc3dz3hzball'),
			deviation: -1,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var b = this.fetchSelectNum(0);
				if(b < 1){
					return '至少选择1个和值';	
				}
				return true;
			},
			/**
			 * 获取投注字符串数组
			 * @param void
			 * @memberOf BallCollection
			 * @return result,如：{
			 * 						key:'ssq_common', //玩法对应key值
			 * 						value:{
			 * 							l1: ['01','02','03','04','05','06'],
			 * 							l2: ['01','02']
			 * 						},
			 * 						bet: 2,	//注数,
			 * 					}
			 * @type object
			 */
			getBetArray: function(){
				var self = this,
					r = [],
					selectArray = this.getSelectArray();
				var resultArr = Tool.getSummationPermutation(selectArray[0],3);
				
				var tmp = {}, num, str, i;
				var nums = Tool.getSummationPermutation(selectArray[0], 3);  // 计算投注号码并临时保存
	            for (i = nums.length; -- i > -1;){
                	num = nums[i].sort();
                	str = num.join("");
                	if (! (num[0] == num[1] || num[1] == num[2]) || num[0] == num[2] || tmp[str]){
                    	nums.splice(i, 1);
                	}else{
                    	tmp[str] = 1;
                	}
             	}
				_.each(nums,function(n){
					var obj  = {
						key: 'fc3d_z3',
						value: {
							l1: n
						},
						bet: 1,
						betstr: self.getBetString(n),
						canEdit: false
					};
					r.push(obj);
				});
				return r;
			},
			/**
			 * 获得投注字符串，用于提交订单
			 * @memberOf 
			 * @name getBetString
			 * @return 
			 */
			getBetString: function(n){
				/**
				 * 0 -> 直选
				 * 1 -> 组三
				 * 2 -> 组六
				 */
				return n.join('') + ':1';
			}
		};
	};
	
	
	
	var appConfig = function(step,collection){
		return $.extend({
			step: step
		},{
			el: '#fc3d_z3hz',
			collection: collection
		});
	};
	

	return {
		initialize: function(step){
			var self = this;
			Layout.initialize().renderView('#fc3dZ3HzTemp',step);
			//延迟500ms，保证在页面切换动画完成之后，执行业务逻辑
			_.delay(function(){
				Layout.doAbacusScroll().doTypeListScroll(0);
				C.fc3dz3hzballcollection = new Ball.Collection(collectionConfig());
				Tool.detectLocalData('fc3dz3hzball',C.fc3dz3hzballcollection);
				C.fc3dz3hzballapp = new Ball.App(appConfig(step,C.fc3dz3hzballcollection));
			},500);
		}
		
	};
});