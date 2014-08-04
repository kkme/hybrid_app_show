define(['mmAnimate', '../modules/feedbackModule'], function() {
	avalon.define('feedback', function(vm) {});
	avalon.scan();

	return {
		init: function(step) {
			// 改变导航条
			require('../config/navModule', function(nav) {
				nav.init('/feedback', step, 'noTitle');
			});

			// 只显示反馈页
			avalon(document.querySelector('.helpDec')).fadeOut(0);
			avalon(document.querySelector('.feedback')).fadeIn(300);
			document.querySelector('.feedback').style.opacity = 1; // mmAnimate 模块缺陷，hack，坑爹
		}
	};
});