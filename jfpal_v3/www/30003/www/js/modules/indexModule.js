define(['avalon', 'text!../../view/templateHtml/index.html', 'text!../../view/templateHtml/share_tpl_1.html'], function(avalon, indexHtml, shareTpl) {
	avalon.ui['indexui'] = function(element, data, vmodels) {
		var vmodel = avalon.define(data.indexuiId, function(vm) {
			vm.$init = function() {
				element.innerHTML = indexHtml + shareTpl;
				avalon.scan(element, [vmodel].concat(vmodels));
			};
			vm.phoneType = []; // ajax 取回的数据渲染
			vm.isIndex = true; // 是否显示右箭头
			// 跳转到支持手机型号列表页
			vm.toSPView = function() {
				avalon.router.navigate('!/surPho/1');
			};
			// 跳转到手机设置页
			vm.toPhoSetView = function(id) {
				if (id != 7) {
					winObj.id = id;
					avalon.router.navigate('!/phoSet/1');
				} else {
					// 如果是 其他手机，则跳转到获取更多帮助
					avalon.router.navigate('!/helpDec/3');
				}
			};
		});
		return vmodel;
	};

	avalon.ui['indexui'].defaults = {};

	return avalon;
});