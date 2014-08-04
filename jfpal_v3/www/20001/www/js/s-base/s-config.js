data_env = "pro";

C.Config = $.extend(C.Config, {
	playType: 200,
	maxBt: 99999,
	minMatchLength: 2,
	unit: 20,
	hasRepeat: false,
	hasRightBar: true,
	betPlayType: 0,

	matchDataUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getMatchsInfoAjax.do', //生产环境
	matchDataUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getMatchsInfoAjax.do', //生产环境
	matchDataUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getMatchsInfoAjax.do', //开发环境
	getMatchDataUrl: function(){
		return this['matchDataUrl_' + data_env];
	},
	
	rewardDataListUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getAwardMatchsAjax.do', //生产环境
	rewardDataListUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getAwardMatchsAjax.do', //生产环境
	rewardDataListUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getAwardMatchsAjax.do', //开发环境
	getRewardDataListUrl: function(){
		return this['rewardDataListUrl_' + data_env];
	},

	formatDate: function(date) {
		return date.getFullYear() + '年' + this.bitHandle(date.getMonth() + 1) + '月' + this.bitHandle(date.getDay()) + '日 ' + this.bitHandle(date.getHours()) + ':' + this.bitHandle(date.getMinutes()) + ':' + this.bitHandle(date.getSeconds());
	},
	bitHandle: function(num) {
		return (Number(num) < 10) ? '0' + num : num;
	},
	changeUrl: function(url, node){
		node.href = url;
		this.simulateClick(node);
	},
	leftBar: function() {
		C.Config.changeUrl('index-alipay-native-app.html#!nav/1', $('#simulateDom')[0]);
	}
});

C.DataCache = {
	issueId: null,
	matchList: [],
	totalPage: 1,
	page: 1,
	matches: {},
	bet: {
		size: 0,            //比赛场次
		arr: []             //统计数组
	},
	passType: [],
	bt: 1,
	betNum: 0,
	betFee: 0,
	historyMatch: {}
}; 
_.extend(C.DataCache, Backbone.Events);

_.toggleClass = function(node, className) {
	if (node.hasClass(className)) {
		node.removeClass(className);
		return;
	}
	node.addClass(className);
};

String.prototype.sub = function(n) {    
	var r = /[^\x00-\xff]/g;    
	if (this.replace(r, "mm").length <= n) {
		return this;  
	}     
	var m = Math.floor(n/2);    
	for (var i = m; i < this.length; i++) {
		if (this.substr(0, i).replace(r, "mm").length == n) {    
			return this.substr(0, i);
		} else if (this.substr(0, i).replace(r, "mm").length > n)  {
			return this.substr(0, i-1);
		}
	}
	return this;   
};  
