
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var App = require('../s-base/app');

	C.Config = $.extend(C.Config, {
		lotteryType: 16,
		lotteryTypeName: 'DC_SPF',
		lotteryTypeLocalName: '足球单场',
		minMatchLength: 1,
		hasRepeat: true,
		passType: {
			1: ['单关'],
			2: ['2串1', '2串3'],
			3: ['3串1', '3串4', '3串7'],
			4: ['4串1', '4串5', '4串11', '4串15'],
			5: ['5串1', '5串6', '5串16', '5串26', '5串31'],
			6: ['6串1', '6串7', '6串22', '6串42', '6串63'],
			7: ['7串1'],
			8: ['8串1'],
			9: ['9串1'],
			10: ['10串1'],
			11: ['11串1'],
			12: ['12串1'],
			13: ['13串1'],
			14: ['14串1'],
			15: ['15串1']
		},
		matchDataUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getMatchsInfoDcAjax.do', //生产环境
		matchDataUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getMatchsInfoDcAjax.do', //生产环境
		matchDataUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getMatchsInfoDcAjax.do'//开发环境
	});

	C.ZQDC = new App.app({
		id: 'C.ZQDC'
	});
});