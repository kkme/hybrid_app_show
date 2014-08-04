define(['avalon', 'text!../../view/templateHtml/phoSet.html'], function(avalon, phoSet) {
	avalon.ui['phoSetui'] = function(element, data, vmodels) {
		var vmodel = avalon.define(data.phoSetuiId, function(vm) {
			vm.$init = function() {
				element.innerHTML = phoSet;
				avalon.scan(element, [vmodel].concat(vmodels));
			};
			vm.phoneType = {}; // ajax 取回的数据渲染

			// 获取更多帮助
			vm.toHelpMore = function() {
				avalon.router.navigate('!/helpDec/1');
			};
		});
		return vmodel;
	};

	avalon.ui['phoSetui'].defaults = {};

	return avalon;
});