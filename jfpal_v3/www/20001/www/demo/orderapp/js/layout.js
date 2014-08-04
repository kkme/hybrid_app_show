/**
 * @fileoverview  布局管理
 * @dependencise: iscroll
 */

/**
 * 声明布局模块
 */
define(function(require, exports) {
    /**
     * 引入依赖模块
     */
    var iscroll = require('../../../js/lib/iscroll'); //引入iscroll4库

    /**
     * 返回外部调用接口
     * {
     *		init: function(){},
     *		handleLayout: function(){},
     *		buildScroll: function(){}
     * }
     */
    return {
		_key: null,
		initialize: function(router, type) {
			if (this.router) {
				return;
			}
			this.router = router;
			$('#order-loading').remove();
		},
		initRoute: function() {},
		setListRoute: function() {},
		initDetailRoute: function() {},
		setDetailRoute: function() {},
		setLayout: function() {},
		setListSelect: function() {},
		buildScroll: function(id, cfg) {
			return new iscroll.iScroll(id, cfg);
		},
		refreshScroll: function(scroll, tag) {
			if (typeof scroll === 'undefined') {
				return;
			}
			scroll.refresh();
			tag || scroll.scrollTo(0, 0);
		},
		destroyScroll: function(scroll) {
			if (typeof scroll === 'undefined') {
				return;
			}
			scroll.destroy();
		}

    };
});
