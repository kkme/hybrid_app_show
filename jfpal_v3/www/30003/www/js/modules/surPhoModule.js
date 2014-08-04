define(['avalon', 'text!../../view/templateHtml/share_tpl_1.html'], function(avalon, shareTpl) {
	avalon.ui['surPhoui'] = function(element, data, vmodels) {
		var vmodel = avalon.define(data.surPhouiId, function(vm) {
			vm.$init = function() {
				element.innerHTML = shareTpl;
				document.querySelector('.surPho li').removeAttribute('ms-on-tap');
				avalon.scan(element, [vmodel].concat(vmodels));
			};
			vm.phoneType = []; // ajax 取回的数据渲染
			vm.isIndex = false; // 是否显示右箭头
		});
		return vmodel;
	};

	avalon.ui['surPhoui'].defaults = {};

	return avalon;
});