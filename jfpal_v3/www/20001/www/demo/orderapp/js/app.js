
/**
 * 订单启动入口
 */
define(function(require, exports) {
	require('./config');  //引入配置项
	require('./tool');    //引入工具集

	(function() {
        if (device.platform == 'Android') {
        	document.addEventListener('backbutton', function() {
        		C.Config.leftBar();
        	}, false);
        } else if (device.platform == 'iOS') {
        	$('.leftButton').addClass('show');
            if (device.version.indexOf('7') == 0) {
                $('nav, .order-list, .order-detail').addClass('ios7');
            }
        }
    })();

	// 前进后退
	$('.leftButton').on('tap', function() {
		C.Config.leftBar();
	});
	
    if(navigator.notification){
        window.alert = navigator.notification.alert;
    }
       
	//获取参数
	var user = C.Tool.parseURL('sid'),
		env = C.Tool.parseURL('host') || 'pro',
		layout = 'single',
		mode = 'jfpal',
		type = C.Tool.parseURL('type') || 'all';

	//重设配置项
	C.Config = $.extend(C.Config , {
		data_user: user,
		data_env: env,
		data_layout: layout,
		data_mode: mode
	});

	//引入布局模块 —— layout
	C.Layout = require('./single');

	//引入模式模块 —— mode
	C.Mode = require('./jfpal');
	C.Mode.initialize();
	
	/**
	 * app控制器
	 * @class AppController
	 * @name AppController
	 */
	AppController = Backbone.Router.extend({
		routes: {
			'': 'init',                                    //null
			'!list/:list': 'setOrderList',                  //single layout list 
			'!detail/:detail': 'setOrderDetail'             //single layout detail
		},
		initialize: function() {
			C.Layout.initialize(this);
		},
		/**
		 * 初始化路由
		 * @name init
		 */
		init: function() {
			C.Layout.initRoute(type);
		},
		/**
		 * 单栏layout: list
		 * @name setOrder
		 */
		setOrderList: function(list) {
			require.async('./orderList', function(orderList) {
				orderList.initialize(list);
			});
		},
		/**
		 * 单栏layout: detail
		 * @name setOrder
		 */
		setOrderDetail: function(detail) {
			require.async('./orderDetail', function(orderDetail) {
				orderDetail.initialize(detail);
			});
		},
	});
	window['appcontroller'] = new AppController;
	Backbone.history.start();
});
