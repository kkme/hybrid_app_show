
/**
 * 声明全局配置模块
 */

define(function(require, exports) {

	window['C'] = {};

	/**
	 * 配置项
	 */
	C.Config = {
		/**
		 * 每页订单数
		 */
		unit: 10,
		/**
		 * 每页订单数
		 */
		data_username: 'sid',
		/**
		 * 用户
		 */
		data_user: null,
		/**
		 * 环境
		 * dev  开发
		 * pre  预发
		 * pro  生产
		 */
		data_env: 'pro',

		/**
		 * 数据接口域名
		 */
		domain_pro: 'GetUserLotteryBetRecord',                      //生产环境 -- 所有投注记录
        domain_reward_pro: 'GetAwardRecord',                         //生产环境 -- 中奖的投注记录
		domain_pre: 'http://caipiao.wapa.taobao.com/lottery',      //预发环境
		domain_dev: 'http://caipiao.waptest.taobao.com/lottery',   //开发环境
		getDomain: function() {
			return this['domain_' + this.data_env];
		},

		/**
		 * 数据接口地址
		 */
		list_interface: '/html5/getMylotteryListAjax.do',
		order_pay_interface: '/html5/getOrderPayNumAjax.do',
		detail_dg_interface: '/html5/getOrderDetailAjax.do',
		detail_zh_interface: '/html5/getPursueDetailAjax.do',
		detail_hm_interface: '/html5/getUnitedDetailInfoAjax.do',
		getDetailInterface: function(orderType) {
			var _interface = null;
			switch (orderType) {
				case 0:
					_interface = this.detail_dg_interface;
					break;
				case 1:
					_interface = this.detail_hm_interface;
					break;
				case 2:
					_interface = this.detail_hm_interface;
					break;
				case 3:
					_interface = this.detail_zh_interface;
					break;
				default:
					_interface = this.detail_dg_interface;
					break;
			}; 
			return _interface;
		},

		/**
		 * 登录地址
		 */
		login_pro: 'http://login.m.taobao.com/login.htm',          //生产环境
		login_pre: 'http://login.m.taobao.com/login.htm',          //预发环境
		login_dev: 'http://login.waptest.taobao.com/login.htm',    //开发环境
		getLoginUrl: function() {
			return this['login_' + this.data_env];
		},		
		/**
		 * 支付宝付款地址
		 */
		pay_pro: 'http://mali.alipay.com/w/trade_pay.do',          //生产环境  
		pay_pre: 'http://mali.alipay.com/w/trade_pay.do',          //预发环境  
		pay_dev: 'http://mali.alipay.net/w/trade_pay.do',          //开发环境
		getPayUrl: function(env) {
			return this['pay_' + this.data_env];
		},

		/**
		 * 异常
		 */
		errCodeMap: {
			'NEW_LOTTERY_USER': '继续购彩需要您完善身份信息，请访问<a href="http://caipiao.m.taobao.com/">淘宝彩票</a>，进入我的彩票添加信息',
			'SYSTEM_CONFIG_ERROR': '检查系统配置错误',
			'ID_CARD_NUMBER_INVALID': '用户身份信息验证失败'
		}
		
	};

	/**
	 * 过程中数据缓存
	 */
	C.DataCache = {
		/**
		 * 列表类型
		 */
		listType: null,

		/**
		 * 分页管理
		 */
		pageInfo: {
			pageSize: 1000,
			page: 1,
		},
		
		/**
		 * 当前订单详情
		 */
		item: null,
		
		/**
		 * 重置分页
		 */
		resetPage: function() {
			this.pageInfo = {
				pageSize: 1000,
				page: 1,
			};
		}
	};	

});