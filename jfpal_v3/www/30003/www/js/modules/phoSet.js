define(['mmAnimate', '../modules/phoSetModule'], function() {
	avalon.define('phoSet', function(vm) {});
	avalon.scan();

	return {
		init: function(step, phoSet) {
			avalon.vmodels['phoSet_wgt']['phoneType'] = phoSet; // 更新组件数据

			// 改变导航条
			require('../config/navModule', function(nav) {
				nav.init('/phoSet', step, phoSet.name);
			});

			// 只显示支持手机型号列表页
			avalon(document.querySelector('.index')).fadeOut(0);
			avalon(document.querySelector('.helpDec')).fadeOut(0);
			avalon(document.querySelector('.phoSet')).fadeIn(300);
			document.querySelector('.phoSet').style.opacity = 1; // mmAnimate 模块缺陷，hack，坑爹
		}
	};
});