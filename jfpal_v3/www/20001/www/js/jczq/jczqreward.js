
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var Tool = require('../base/tool'),
		Layout = require('../s-base/layout'),
		Calendar = require('../s-base/calendar'),
		Reward = require('../s-base/reward');

	C.Config = $.extend(C.Config, {
		lotteryType: 21,
		lotteryTypeName: 'JCZQ',
		lotteryTypeLocalName: '竞彩足球'
	});

	C.JCZQ = new Reward.reward({
		getData: function() {
			var self = this;
			//Calendar
			var date = new Date(),
				curDate = date.getFullYear() + '' + C.Config.bitHandle(date.getMonth() + 1) + '' + C.Config.bitHandle(date.getDate());
			self.dateTime = curDate;
			self.calendar = Calendar.create('#myCalendar',{
				trigger: '#calendar',
				onSelect: function(o){
					$('#myCalendar').addClass('hidden');
					C.JCZQ._tag = false;
					var t = o.year + '' + C.Config.bitHandle(o.month) + '' + C.Config.bitHandle(o.date);
					//如两次选择时间相同，跳出
					if(self.dateTime == t) return;
				
					Layout.transBox('正在努力请求数据');
					self.dateTime = t;
					var url = C.Config.getRewardDataListUrl() + '?callback=C.JCZQ.initReward&lotteryTypeId=' + C.Config.lotteryTypeName + '&dateTime=' + t + '&t=' + new Date().getTime();
					Tool.getScript(url);
				},
				disabledStart: date.getFullYear() + '' + C.Config.bitHandle(date.getMonth() + 1) + '' + C.Config.bitHandle(date.getDate() + 1)
			});				
			
			$(document).on('click',function(e){
				$('#myCalendar').addClass('hidden');
				Layout.removeTransBox();
				self._tag = false;
			});
			
			//get Data
			var url = C.Config.getRewardDataListUrl() + '?callback=C.JCZQ.initReward&lotteryTypeId=' + C.Config.lotteryTypeName + '&dateTime=' + self.dateTime + '&t=' + new Date().getTime();
			Tool.getScript(url);
		},
		change: function(self) {
			if (this._tag) {
				return;
			}
			this._tag = true;
			Layout.buildMaskLayer();
			C.Config.simulateClick($('#calendar')[0]);
		}
	});
});


