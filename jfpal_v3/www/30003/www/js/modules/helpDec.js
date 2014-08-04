define(['mmAnimate', '../modules/helpDecModule'], function() {
	avalon.define('helpDec', function(vm) {});
	avalon.scan();

	return {
		init: function(step) {
			// 改变导航条
			require('../config/navModule', function(nav) {
				nav.init('/helpDec', step, 'noTitle');
			});

			// 只显示帮助说明页
			avalon(document.querySelector('.index')).fadeOut(0);
			avalon(document.querySelector('.phoSet')).fadeOut(0);
			avalon(document.querySelector('.feedback')).fadeOut(0);
			avalon(document.querySelector('.helpDec')).fadeIn(300);
			document.querySelector('.helpDec').style.opacity = 1; // mmAnimate 模块缺陷，hack，坑爹
		}
	};
});