define(['mmAnimate', '../modules/surPhoModule'], function() {
	avalon.define('surPho', function(vm) {});
	avalon.scan();

	return {
		init: function(step, surPho) {
			avalon.vmodels['surPho_wgt']['phoneType'] = surPho; // 更新组件数据

			// 改变导航条
			require('../config/navModule', function(nav) {
				nav.init('/surPho', step, 'noTitle');
			});

			// 只显示支持手机型号列表页
			avalon(document.querySelector('.index')).fadeOut(0);
			avalon(document.querySelector('.surPho')).fadeIn(300);
			document.querySelector('.surPho').style.opacity = 1; // mmAnimate 模块缺陷，hack，坑爹
		}
	};
});