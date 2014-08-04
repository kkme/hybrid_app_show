
/*
 * @author hangu.mh
 * 单栏结构
 */

define(function(require, exports) {
	var Layout = require('./layout');
	
	return $.extend(Layout, {
		initRoute: function(type) {
			C.Tool.navigate(this.router, '!list/' + type, true);
		},
		setListRoute: function(type) {
			C.Tool.navigate(this.router, '!list/' + type);
		},
		setDetailRoute: function(detail) {
			C.Tool.navigate(this.router, '!detail/' + detail.idHelper);
		},
		setLayout: function(key) {
			//显示左侧或右侧
			this._key = key;
			if (key === 'list') {
				$('#order-list').removeClass('hidden');
				$('#order-detail').addClass('hidden');
			} else {
				$('#order-list').addClass('hidden');
				$('#order-detail').removeClass('hidden');
			}
		}
	});

});