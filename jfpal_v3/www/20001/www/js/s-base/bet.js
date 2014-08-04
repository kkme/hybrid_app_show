
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	return {
		verify: function() {
			if (C.DataCache.bet.size < C.Config.minMatchLength) {
				alert('至少选择' + C.Config.minMatchLength + '场比赛，方可投注', function(){}, '提示');
				return false;
			} else if (C.DataCache.passType.length <= 0) {
				alert('至少选择1种过关方式，方可投注', function(){}, '提示');
				return false;
			} else if (C.DataCache.bt <= 0) {
				alert('倍投不能为空', function(){}, '提示');
				return false;
			} else if (C.DataCache.betFee > 2000) {
				alert('单笔投注金额不能超过2000元', function(){}, '提示');
				return false;
			}
			return true;
		},
		/**
		 * 整合提交订单的各字段值
		 * @memberOf BetAppView
		 */
		getFormFields: function(callback){
			/**
			 * agree 是否同意购彩协议 , note: 1 ->同意	0 -> 不同意
			 * lotteryTypeId 彩种ID , note: 21 -> 竞彩足球(建立全彩种lotteryTypeId查询map，config.js)
			 * issueId 彩期ID ， note: xxxx -> 服务器端获取
			 * orderType 订单类型， note: 0 -> 代购	 1 -> 发起合买	2 -> 参与合买	3 -> 追号
			 * buyFrom 订单来源 note: 1 -> 无线
			 * ttid	固定字段	note: html5
			 * playType	竞彩足球特有 note:	0 -> 胜平负玩法
			 * multiple 倍投
			 * totalNum 注数
			 * totalFee 金额
			 * numberStrings 选号格式 note：201205034014:1/201205034015#:1/201205034016#:3,1,0/201205034017:1,0/201205034018:0_3*1^4*1  -> 201205034014 比赛对阵标识  # 设胆  3 1 0 胜平负
			 * callback jsonp回调，开发自定义
			 * sid 登陆后回调参数，用于验证用户登陆状态
			 */
			var numberStrings = this.getBetString() + '_' + this.getpassType(),
				agree = 1,
				lotteryTypeId = C.Config.lotteryType,
				issueId = C.DataCache.issueId,
				orderType = 0,
				buyFrom = 1,
				ttid = encodeURIComponent((C.Config.platform === 'ios') ? 'zfb001#ios' : 'zfb001#android'),
				playType = C.Config.betPlayType,
				multiple = C.DataCache.bt,
				totalNum = C.DataCache.betNum,
				totalFee = C.DataCache.betFee,
				token = jfpal.session.token;  
			return '?agree=' + agree + '&lotteryTypeId=' + lotteryTypeId + '&issueId=' + issueId + '&orderType=' + orderType + '&buyFrom=' + buyFrom + '&ttid=' + ttid + '&playType=' + playType + '&multiple=' + multiple + '&totalNum=' + totalNum + '&totalFee=' + totalFee + '&numberStrings=' + numberStrings + '&callback=' + callback + '&token=' + token; 
		},
		getBetString: function() {
			var arr = [];
			for(var key in C.DataCache.matches) {
				var str = '',
					val = C.DataCache.matches[key];
				if (val.selectNum <= 0) {
					continue;
				}
				str += val.matchOrder;
				str += ':';
				str += val.win ? '3,' : '';
				str += val.even ? '1,' : '';
				str += val.negative ? '0,' : '';
				arr.push(str.slice(0, -1));
			}
			return arr.join('/');
		},
		getpassType: function() {
			var arr = [];
			_.each(C.DataCache.passType, function(pt) {
				var pt = pt.replace('串', '*').replace('单关', '1');
				if (pt.slice(0, 1) <= C.DataCache.bet.size)	{
					arr.push(pt);
				}
			});
			return arr.join('^');
		}
	};
});
