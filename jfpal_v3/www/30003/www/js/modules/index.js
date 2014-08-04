define(['mmAnimate', '../modules/indexModule'], function() {
	avalon.define('index', function(vm) {});
	avalon.scan();

	return {
		init: function(step, brandInfo) {
			avalon.vmodels['index_wgt']['phoneType'] = brandInfo; // 更新组件数据

			// 改变导航条
			require('../config/navModule', function(nav) {
				nav.init('/index', step, 'noTitle');
			});

			// 只显示首页
			avalon(document.querySelector('.surPho')).fadeOut(0);
			avalon(document.querySelector('.phoSet')).fadeOut(0);
			avalon(document.querySelector('.helpDec')).fadeOut(0);
			avalon(document.querySelector('.index')).fadeIn(300);
		}
	};
});