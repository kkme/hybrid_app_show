
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var App = require('../s-base/app');

	C.Config = $.extend(C.Config, {
		lotteryType: 20,
		lotteryTypeName: 'JCLQ',
		lotteryTypeLocalName: '竞彩篮彩',
		betPlayType: 2,
		hasRightBar: false,
		passType: {
			2: ['2串1'],
			3: ['3串1'],
			4: ['4串1'],
			5: ['5串1'],
			6: ['6串1'],
			7: ['7串1'],
			8: ['8串1']
		}
	});

	C.JCLQ = new App.app({
		id: 'C.JCLQ'
	});
});