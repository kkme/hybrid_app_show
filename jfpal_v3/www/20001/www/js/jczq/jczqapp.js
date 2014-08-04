
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var App = require('../s-base/app');

	C.Config = $.extend(C.Config, {
		lotteryType: 21,
		lotteryTypeName: 'JCZQ',
		lotteryTypeLocalName: '竞彩足球',
		passType: {
			2: ['2串1'],
			3: ['3串1', '3串3', '3串4'],
			4: ['4串1', '4串4', '4串5', '4串6', '4串11'],
			5: ['5串1', '5串5', '5串6', '5串10', '5串16', '5串20', '5串26'],
			6: ['6串1', '6串6', '6串7', '6串15', '6串20', '6串22', '6串42', '6串50', '6串57'],
			7: ['7串1', '7串7', '7串8', '7串21', '7串35', '7串120'],
			8: ['8串1', '8串8', '8串9', '8串28', '8串56', '8串70', '8串247']
		}
	});

	C.JCZQ = new App.app({
		id: 'C.JCZQ'
	});
});