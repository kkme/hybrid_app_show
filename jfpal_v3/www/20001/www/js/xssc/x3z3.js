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
			key: 'xssc_x3z3',
			localStorage: new Store('xsscx3z3ball'),
			deviation: 0,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var b = this.fetchSelectNum(0);
				if(b < 2){
					return '请选择2个或以上的号码进行投注';	
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
				var nums = this.getSelectArray()[0], result = [], k = this.key, size = nums.length, i = 0, j;
				for (; i < size; ++ i){
					for (j = 0; j < size; ++ j){
						if(j != i){
							result[result.length] = {
								key: k,
								value: {
									l1: [nums[i],nums[i],nums[j]]
								},
								bet: 1,
								betstr: this.getBetString(nums[i] + ',' + nums[i] + ',' +nums[j]),
								canEdit: false
							};
						}
					}
				}	
				return result;	
			},
			/**
			 * 获得投注字符串，用于提交订单
			 * @memberOf 
			 * @name getBetString
			 * @return 
			 */
			getBetString: function(n){
				return  '6:-,-,' + n;
			}
		};
	};
	
	
	
	var appConfig = function(step,collection){
		return $.extend({
			step: step
		},{
			el: '#xssc_x3z3',
			collection: collection,
			noRepeat: false
		});
	};
	

	return {
		initialize: function(step){
			var self = this;
			Layout.initialize().renderView('#xsscX3Z3Temp',step);
			//延迟500ms，保证在页面切换动画完成之后，执行业务逻辑
			_.delay(function(){
				Layout.doAbacusScroll().doTypeListScroll(-280);
				C.xsscx3z3ballcollection = new Ball.Collection(collectionConfig());
				Tool.detectLocalData('xsscx3z3ball',C.xsscx3z3ballcollection);
				C.xsscx3z3ballapp = new Ball.App(appConfig(step,C.xsscx3z3ballcollection));
			},500);
		}
		
	};
});