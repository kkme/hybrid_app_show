
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var Tool = require('../base/tool'),
		Layout = require('../s-base/layout'),
		Reward = require('../s-base/reward'),
		IssueList = require('./issueList');

	C.Config = $.extend(C.Config, {
		lotteryType: 16,
		lotteryTypeName: 'DC_SPF',
		lotteryTypeLocalName: '足球单场',
		rewardDataListUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getAwardMatchsDcAjax.do', //生产环境
		rewardDataListUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getAwardMatchsDcAjax.do', //生产环境
		rewardDataListUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getAwardMatchsDcAjax.do', //开发环境

		rewardIssueListUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getIssueLastLuckNumsList.do', //生产环境
		rewardIssueListUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getIssueLastLuckNumsList.do', //生产环境
		rewardIssueListUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getIssueLastLuckNumsList.do', //开发环境
		getRewardIssueListUrl: function(){
			return this['rewardIssueListUrl_' + data_env];
		}
	});

	C.ZQDC = new Reward.reward({
		getData: function() {
			var self = this,
				url = C.Config.getRewardIssueListUrl() + '?typeId=' + C.Config.lotteryType + '&page=1&pageSize=10&callback=C.ZQDC.handleIssue';
			
			$(document).on('click',function(e){
				self.issueListView.$el.hide();
				Layout.removeTransBox();
			});
			
			//get issueList
			Tool.getScript(url);
		},
		handleIssue: function(data) {
			if (data.status === true && data.issueList.length > 0) {
				var issueList = C.ZQDC.issueList = data.issueList,
					curIssue = issueList[0];
				this.getRewardData(curIssue.issue, curIssue.issue_id);	
			} else {
				$('#loading').html('未能获取彩期').removeClass('hidden');
			}
		},
		getRewardData: function(issue, issueId) {
			if (typeof jfpal !== 'undefined') {
				jfpal.navigation.setRightItemTitle('第' + issue + '期');
			}
			var url = C.Config.getRewardDataListUrl() + '?callback=C.ZQDC.initReward&lotteryTypeId=' + C.Config.lotteryTypeName + '&issueId=' + issueId + '&playType=' + C.Config.playType + '&t=' + new Date().getTime();
			Tool.getScript(url);
		},
		change: function(self) {
			Layout.buildMaskLayer();
			if (!self.issueListView) {
				self.issueListView = new IssueList.view(null, self);
				self.issueListView.model.set('issueList', self.issueList);
				self.issueListView.render()
			} 
			self.issueListView.$el.show();
		},
		triggerChange: function(node) {
			C.ZQDC.issueListView.$el.hide();
			Layout.transBox('正在努力请求数据');
			C.ZQDC.getRewardData(node.attr('data-issue'), node.attr('data-id'));
		}
	});
});


