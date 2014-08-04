/**
 * @author donghan
 */

/**
 * app初始配置项
 */
window['C'] = {};
window['C'].Config = {
	//if
	//彩种key值，此key值更新
	key: '',
	step: 1,
	//获取系统平台，主要区分ios和android
	platform: (function(){
		var useragent = navigator.userAgent.toLowerCase();
		if(useragent.indexOf('iphone') >= 0 || useragent.indexOf('ipad') >= 0 || useragent.indexOf('ipod') >= 0){
			return 'ios';
		}else if(useragent.indexOf('android')){
			return 'android';
		}else{
			return 'other';
		}
	})(),
	//true->初次加载应用或刷新	false->子页面之间切换
	appLoadStatus: true,
	//投注篮待编辑的单注
	editModel: {},
	//记录是否是继续选号（继续选号状态，选号盘多出取消选号功能）
	isContinue: false,
	//用于标示彩票订单来源，默认是html5
	ttid: function(){
		return 'html5';
	},
	//彩种对应hash对象(用于初始化合买表单项)
	lotteryTypeHash: {
		'ssq': '双色球',
		'fc3d': '福彩3D',
		'swxw': '15选5'
	},
	//lotteryTypeId查询map
	lotTypeNumberId: {
		ssq: '01',
		fc3d: '05',
		swxw: '10'
	},
	//已经完成彩种
	doneLot: [1,22,2],
	setToolBar: function(){},
	//配置开奖公告包含的彩种
	rewardTypeList: 'ssq,fc3d,swxw',
	/**
	 * 获得开奖公告包含彩种对应的typeId列表
	 * @return string ,如：'1,8,14,2,6,18,22,13,7'
	 */
	getRewardTypes: function(){
		var self = this;
		var arr = this.rewardTypeList.split(','),
			_arr = [];
		_.each(arr,function(n){
			_arr.push(self.lotTypeNumberId[n]);
		});
		return _arr.join(',');
	},
	//竞彩开奖结果，接口不会返回，需要人工添加
	rewardArray: [{"lotteryType": "21"},{"lotteryType": "20"}],
	/**
	 * 选号盘对应的投注页hash，用于配置其“返回”“完成”
	 */
	abacusBetMap: {
		ssq_common: '#!ssq/bet/2',
		
		fc3d_zhx: '#!fc3d/zhx/bet/2',
		fc3d_zhxhz: '#!fc3d/zhx/bet/2',
		fc3d_z3: '#!fc3d/z3/bet/2',
		fc3d_z3hz: '#!fc3d/z3/bet/2',
		fc3d_z6: '#!fc3d/z6/bet/2',
		fc3d_z6hz: '#!fc3d/z6/bet/2',
		

		swxw_common: '#!swxw/bet/2'
	},
	/**
	 * 彩种名称map查询
	 */
	lotNameMap: {
		ssq: '双色球',
		fc3d: '福彩3D',
		swxw: '15选5'
	},
	/**
	 * key值对应的选号盘hash，用于配置投注页“手选”
	 */
	keyAbacusMap: {
		ssq_common: '#!ssq/common/3',
		fc3d_zhx: '#!fc3d/zhx/3',
		fc3d_zhxhz: '#!fc3d/zhxhz/3',
		fc3d_z3: '#!fc3d/z3/3',
		fc3d_z3hz: '#!fc3d/z3hz/3',
		fc3d_z6: '#!fc3d/z6/3',
		fc3d_z6hz: '#!fc3d/z6hz/3',
		swxw_common: '#!swxw/common/3'
	},
	betHashMap: {
		ssq: ['#!ssq/bet/2'],
		swxw: ['#!swxw/bet/2'],
		fc3d: ['#!fc3d/zhx/bet/2','#!fc3d/z3/bet/2','#!fc3d/z6/bet/2']
	},
	/**
	 * 验证用户登陆接口（返回用户名） 
	 */
	checkLoginUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getUserInfoAjax.do',  //生产环境
	checkLoginUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getUserInfoAjax.do',  
	checkLoginUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getUserInfoAjax.do',  //开发环境
	getCheckLoginUrl: function(){
		return this['checkLoginUrl_' + data_env];
	},
	/**
	 * 彩期接口
	 */
	issueDataUrl_pro: 'GetLotteryCurrentPeriod',  //生产环境
	issueDataUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getIssueListAjax.do',  //生产环境
	issueDataUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getIssueListAjax.do',	//开发环境
	getIssueDataUrl: function(){
		return this['issueDataUrl_pro'];
	},
	/**
	 * 开奖公告聚合页数据接口 (多彩种)
	 */
	rewardDataUrl_pro: 'GetLotteryAwardNumber', //生产环境
	rewardDataUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getIssueLastLuckNums.do', //生产环境
	rewardDataUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getIssueLastLuckNums.do', //开发环境
	getRewardDataUrl: function(){
		return this['rewardDataUrl_pro'];
	},
	/**
	 * 开奖公告列表页数据接口 ---单彩种
	 */
	rewardDataListUrl_pro: 'GetLotteryNumber', //生产环境
	rewardDataListUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getIssueLastLuckNumsList.do', //生产环境
	rewardDataListUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getIssueLastLuckNumsList.do', //开发环境
	getRewardDataListUrl: function(){
		return this['rewardDataListUrl_' + data_env];
	},
	/**
	 * 提交投注接口(不区分代购、合买)
	 */
	betUrl_pro: 'SaveLotteryBetOrder', //生产环境
	betUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getSubmitOrderAjax.do', //生产环境p
	betUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getSubmitOrderAjax.do', //开发环境
	getBetUrl: function(){
		return this['betUrl_pro'];
	},
	/**
	 * 用户登陆URL
	 */
	loginUrl_pro: 'http://login.m.taobao.com/login.htm' , //生产环境
	loginUrl_pre: 'http://login.m.taobao.com/login.htm' , //生产环境
	loginUrl_dev: 'http://login.waptest.taobao.com/login.htm' , //开发环境
	getLoginUrl: function(){
		return this['loginUrl_' + data_env];
	},
	/**
	 * 用户登出URL
	 */
	logoutUrl_pro: 'http://login.m.taobao.com/logout.htm' , //生产环境
	logoutUrl_pre: 'http://login.m.taobao.com/logout.htm' , //生产环境
	logoutUrl_dev: 'http://login.waptest.taobao.com/logout.htm' , //开发环境
	getLogoutUrl: function(){
		return this['logoutUrl_' + data_env];
	},
	/**
	 * 注册URL 
	 */
	registerUrl_pro: 'http://u.m.taobao.com/reg/newUser.htm', //生产环境
	registerUrl_pre: 'http://u.m.taobao.com/reg/newUser.htm', //生产环境
	registerUrl_dev: 'http://u.waptest.taobao.com/reg/new_user.htm', //开发环境
	getRegisterUrl: function(){
		return this['registerUrl_' + data_env];
	},
	/**
	 * 我的订单URL 
	 */
    //GetUserLotteryInfo
	myOrderUrl_pro: 'GetUserLotteryBetRecord',  //生产环境
	myOrderUrl_dev: 'http://caipiao.mtest.taobao.com/apps/lottery/wap/demo/order.php?host=dev&mode=html5',  //开发环境
	getMyOrderUrl: function(){
		return this['myOrderUrl_' + data_env];
	},
	/**
	 * 支付页单笔交易URL
	 */
	paySingleUrl_pro: 'http://mali.alipay.com/w/trade_pay.do',  //生产环境  
	paySingleUrl_dev: 'http://mali.alipay.net/w/trade_pay.do', //开发环境
	getPaySingleUrl: function(){
		return this['paySingleUrl_' + data_env];
	},
	/**
	 * 支付页多笔交易URL
	 */
	payMultiUrl_pro: 'http://mali.alipay.com/batch_payment.do',
	payMultiUrl_dev: 'http://mali.alipay.net/batch_payment.do',
	getPayMultiUrl: function(){
		return this['payMultiUrl_' + data_env];
	},
	/**
	 * 提交用户新增信息，姓名、手机号、身份证
	 */
	userInfo_pro: 'http://caipiao.m.taobao.com/lottery/html5/getAndUpdateUserAjax.do',
	userInfo_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getAndUpdateUserAjax.do',
	userInfo_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getAndUpdateUserAjax.do',
	postUserInfo: function(){
		return this['userInfo_' + data_env];
	},
	/**
	 * 跳到我的订单
	 */
	gotoOrder: function(obj,sid,e){
		obj.attr('href',this.getMyOrderUrl() + '&sid=' + sid + '&from=' + encodeURIComponent(location.href));
	},
	/**
	 * 订单处理异常码 （跳转异常显示页）
	 */
	exception: {
		'ERR_LOGIN': '未登录',
		'NEW_LOTTERY_USER': '继续购彩需要您完善身份信息，请访问<a href="http://caipiao.m.taobao.com/">淘宝彩票</a>，进入我的彩票添加信息',
		'ERR_ALPAY_USER': '您没有开通支付宝帐户',
		'ERR_LOTTERY_STOP': '本彩种停售',
		'ERR_NUMBER': '投注号码不能为空',
		'ERR_ISSUE_OVERDUE': '已过期',
		'ERR_AGREE': '您没有同意网上购彩协议',
		'ERR_UNITED_COUNT': '请输入正确的份数',
		'ERR_TOTALFEE': '金额过限',
		'ERR_GETTRADENO': '获取alipayTradeNo失败',
		'SYSTEM_CONFIG_ERROR': '检查系统配置错误',
		'ERR_TAOBAO_USER': '你还没有设置淘宝账户,不能购买彩票',
		'ISSUE_OVERDUE': '购买时再次判断是否过期',
		'ORDER_INFO_VERFICATION_FAILED': '校验失败',
		'CREATE_ORDER_FAILED': '创建淘宝订单和彩票订单失败',
		'ISSUE_STOP': '彩期已经停售，不能购买',
		'MAX_MONEY_PER_ORDER_EXCEED': '单个彩票订单是否超过金额限制',
		'ISSUE_LOTTERY_ORDER_LIMIT': '本期出票已截止，请下期购买',
		'lOTTERY_STOP': '此彩种已停售',
		'LIMIT_NUM_ERROR': '订单限号',
		'MAX_TICKETS_PER_ORDER_EXCEED': '彩票订单的数量是否超过了限制',
		'NOT_SALE_TIME': '竞彩官方停售时间，不能代购',
		'ID_CARD_NUMBER_INVALID': '用户身信息验证失败',
		'MAX_MONEY': '单注超过最大金额'
	},
	/**
	 * 是否先提示探测本地数据
	 */
	tipDetect: true,
	/**
	 * 支付接口，web和app方式不同
	 */
	pay: function(obj){
		//从href中取sid值，同返回的alipay_trade_no一起提交
		var s_id = C.Template.searchJSON(location.search).sid;
		//正常生成交易订单号
		if(obj.tradeNo.indexOf(';') < 0){   //单笔交易
			$('#paybtn').attr('href',this.getPaySingleUrl() + '?alipay_trade_no=' + obj.tradeNo.replace(/;/gi,',') + '&s_id=' + s_id);
		}else{
			//多笔交易
			$('#paybtn').attr('href',this.getPayMultiUrl() + '?trade_nos=' + obj.tradeNo.replace(/;/gi,',') + '&s_id=' + s_id);
		}
		this.simulateClick($('#paybtn')[0]);
	},
	/**
	 * 精简成功提交彩票订单返回页面URL（主要清理url中的订单相关参数）
	 */
	cutPageUrl: function(){
		var search = location.search,
			hash = location.hash;
		var sid = Tool.searchJSON(search).sid;
		C.Config.changeUrl(location.href.replace(search,'').replace(hash,'') + '?sid=' + sid + hash);
	},
	/**
	 * 模拟点击
	 */
	simulateClick: function(el){
		//检测是否webkit内核
		var isWebkit = /webkit/.test(navigator.userAgent.toLowerCase());
		if(isWebkit){
			try{  
	            var evt = document.createEvent('Event');  
	            evt.initEvent('click',true,true);  
	            el.dispatchEvent(evt);  
	        }catch(e){
	        	alert(e);
	        };
		}else{
			el.click();
		}
	},
	checkLogin: function(){},
	_login: function(search){
		var hash = location.hash,
			redirectUrl = encodeURIComponent(location.href.replace(hash,'') + search + hash);
		this.changeUrl(this.getLoginUrl() + '?TPL_redirect_url=' + redirectUrl);
	}
	
};

window['C'].Template = {
    /**
     * 投注关闭倒计时
     * @param {String} endtime 投注结束时间
     * @public
     */
    showTime: function(endDate) {
        var nowDate = new Date();
        
        var leftSecond = parseInt((endDate.getTime() - nowDate.getTime()) / 1000);
        var day = 0, hour = 0, miniute = 0; second = 0;
        
        if (leftSecond > 0) {
            day = parseInt(leftSecond / 3600 / 24);
            hour = parseInt((leftSecond / 3600) % 24);
            miniute = parseInt((leftSecond / 60) % 60);
            second = parseInt(leftSecond % 60);
            
            $("#countdown").html( "<div class='wrap'>"
            				+ (day >= 10 ? ( "<span class='day'>" + parseInt(day / 10)  + "</span>") : "")
            				+ "<span class='day'>" + ( day % 10 ) + "</span>"
            			    + " 天 "
        					+ "<span class='hour'>" + parseInt(hour / 10)  + "</span>"
        					+ "<span class='hour'>" + ( hour % 10 ) + "</span>" 
        					+ " 小时 "
        					+ "<span class='min'>" + parseInt(miniute / 10) + "</span>"
        					+ "<span class='min'>" + ( miniute % 10 ) + "</span>"
        					+ " 分钟 "
        					+ "<span class='sec'>" + parseInt(second / 10) + "</span>"
        					+ "<span class='sec'>" + (second % 10) + "</span>"
        					+ " 秒 </div>");
            $('#submit').removeClass('issueOver');
        }
        else {
            window.clearInterval(C.Template.stopCountDownFlag);
            $("#countdown").html( "<div class='wrap'><span class='error'>已过期</span></div>" );
            $('#submit').addClass('issueOver');
        }
    },
	/**
	 * 位数处理
	 * @name bitHandle
	 * @memberof C.Template
	 * @param {String} num  原数
	 * @param {String} bit  扩充后的位数
	 * @return {string} num  扩充后的数
	 * @type function
	 * @public
	 */
	bitHandle: function(num, bit){
		var len = num.toString().length;
		if(len < bit){
			var str = '';
			for(var i = 0; i < bit - len; i++){
				str += '0';
			}
			return str + num;
		}
		return num;
	},
	/**
	 * 获取人类识别的时间
	 * @name getCommonTime
	 * @memberOf C.Template
	 * @param time{number} new Date().getTime()的返回结果
	 * @return common{string} ，如2012-12-12 19:23
	 */
	getCommonTime: function(time){
		var _date = new Date(time);
		var year = _date.getFullYear(),
			month = this.bitHandle(_date.getMonth()+1,2),
			day = this.bitHandle(_date.getDate(),2),
			hour = this.bitHandle(_date.getHours(),2),
			mins = this.bitHandle(_date.getMinutes(),2);
		var common = year + '-' + month + '-' + day + ' ' + hour + ':' + mins;
		return common
	},
	/**
	 * 处理location.search，返回object
	 * @memberOf C.Template
	 * @name searchJSON
	 * @return object
	 */
	searchJSON: function(search){
		var str = search.replace('?',''),
			arr = str.split('&'),
			obj = {};
		_.each(arr,function(n){
			var a = n.split('=');
			obj[a[0]] = a[1];
		});
		return obj;
	}
};

/**
 * 读取app配置
 */
var scripts = document.getElementsByTagName("script");
eval(scripts[scripts.length - 1].innerHTML);
