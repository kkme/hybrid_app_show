define(['avalon', 'text!../../view/templateHtml/helpDec.html'], function(avalon, helpDec) {
	avalon.ui['helpDecui'] = function(element, data, vmodels) {
		var vmodel = avalon.define(data.helpDecuiId, function(vm) {
			vm.$init = function() {
				element.innerHTML = helpDec;
				avalon.scan(element, [vmodel].concat(vmodels));
			};
		});
		return vmodel;
	};

	avalon.ui['helpDecui'].defaults = {};

	return avalon;
});