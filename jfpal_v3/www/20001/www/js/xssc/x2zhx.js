/**
 * @author yang zhenn
 */


define(function(require,exports){
	var Tool = require('../base/tool'), 	//引入算法库
		Layout = require('../base/layout'),  //引入布局模块
		Ball = require('../base/ball'); //引入选号盘模块
		
	var collectionConfig = function(){
		return {
			lines: 2,
			key: 'xssc_x2zhx',
			localStorage: new Store('xsscx2zhxball'),
			deviation: 0,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var b = this.fetchSelectNum(0),
					d = this.fetchSelectNum(1);
				if(b < 1){
					return '十位至少选择1个号码';	
				}else if(d < 1){
					return '个位至少选择1个号码';
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
				return {
					key: self.key,
					value: {
						l1: selectArray[0],
						l2: selectArray[1]
					},
					bet: selectArray[0].length * selectArray[1].length,
					betstr: self.getBetString(selectArray)
				};
			},
			/**
			 * 获得投注字符串，用于提交订单
			 * @memberOf 
			 * @name getBetString
			 * @return 
			 */
			getBetString: function(arr){
				//[[1,2],[1,2]]
				var result = Tool.getCompoundPermutation(arr,','),
					a = [];
				_.each(result,function(n){
					a.push('1:-,-,-,' + n);
				});
				return a.join('&');
			}
		};
	};
	
	
	
	var appConfig = function(step,collection){
		return $.extend({
			step: step
		},{
			el: '#xssc_x2zhx',
			collection: collection,
			noRepeat: false
		});
	};
	

	return {
		initialize: function(step){
			var self = this;
			Layout.initialize().renderView('#xsscX2ZhxTemp',step);
			//延迟500ms，保证在页面切换动画完成之后，执行业务逻辑
			_.delay(function(){
				Layout.doAbacusScroll().doTypeListScroll(0);
				C.xsscx2zhxballcollection = new Ball.Collection(collectionConfig());
				Tool.detectLocalData('xsscx2zhxball',C.xsscx2zhxballcollection);
				C.xsscx2zhxballapp = new Ball.App(appConfig(step,C.xsscx2zhxballcollection));
			},500);
		}
		
	};
});