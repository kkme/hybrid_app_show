/**
 * @author yang zhenn
 */

var G_DeviceMotionHandler;

define(function(require,exports){
	var Tool = require('./tool'),
		Layout = require('./layout');
	var confirm = require('../widget/confirm/confirm');
	
	var BetModel = Backbone.Model.extend({});
	var BetCollection = Backbone.Collection.extend({
		model: BetModel,
		initialize: function(cfg){
			cfg = $.extend({
				maxBt: 50,
				localStorage: new Store('ssqbet'),
				tempBox: '#ssqBetViewTemp',
				/**
				 * 机选产生一注
				 */
				random: function(){},
				/**
				 * 获取投注投注字符串
				 */
				getNumberString: function(){}
			},cfg);
			Tool.buildCfg.call(this,cfg);
			
			this.bind('add',this.addOne,this);
			this.bind('reset',this.addAll,this);
		},
		/**
		 * 增加数据模型的回调
		 * @memberOf BetCollection
		 * @param data{model} 数据模型
		 * @return void
		 */
		addOne: function(data){
			var betview = new BetView({
				model: data,
				tempBox: this.tempBox
			});
			betview.render();
		},
		/**
		 * 增加全部数据模型
		 * @memberOf BetCollection
		 */
		addAll: function(){
			var self = this, 
				frag = document.createDocumentFragment();
			for(var i = this.models.length;i--;){
				var betview = new BetView({
					model: this.models[i],
					tempBox: self.tempBox
				});
				betview.createFragment(frag);
			}
			C.betapp.oneTimePush(frag);
		},
		
		/**
		 * 清空集合中所有的数据模型
		 * @memberOf BetCollection
		 * @name clear
		 */
		clear: function(){
			for(var i=this.models.length;i--;){
				this.models[i].destroy();
			}
		},
		getPrevdelNo: function(){
			var no = 0;
			this.each(function(model){
				if(model.get('prevdel')){
					no++;
				}
			});
			return no;
		}
	});
	
	/**
	 * 投注蓝视图类
	 * @class BetView
	 * @name BetView
	 */
	var BetView = Backbone.View.extend({
		tagName: 'li',
		events: {
			'click .del': '_delete',
			'swipeLeft': 'showDelete',
			'swipeRight': 'showDelete',
			'longTap': '_showDelete',
			'click': 'editSingle'
		},
		initialize: function(cfg){
			var self = this;
			cfg = $.extend({
				tempBox: 'ssqBetViewTemp'
			},cfg);
			Tool.buildCfg.call(this,cfg);
			
			//监听数据销毁
			this.model.bind('destroy',this.remove,this);
			this.model.bind('change:betstr',this.render,this);
		},
		/**
		 * 获得js模板中数据
		 * @memberOf BetView
		 * @param data{json} 数据模型中的attributes
		 * @return void
		 */
		template: function(data){
			var temp = $(this.tempBox).html();
			return _.template(temp,data);
		},
		/**
		 * 数据渲染
		 * @memberOf BetView
		 */
		render: function(){
			var data = this.model.toJSON(),
				domStr = this.template(data);
			//新增加的投注，有动画效果。fetch时，不用添加anim
			this.$el.html(domStr);
			if(C.Config.platform === 'ios'){
				this.$el.addClass('anim');
			}
			var selectList  = $('#selectList');
			//插入dom
			if(selectList.find('li').length > 0){
				selectList.find('li').eq(0).before(this.$el);
			}else{
				selectList.append(this.$el);
			}
			C.betapp.upFee().guideShow();
			C.shakeSelectscroll.refresh();
		},
		/**
		 * 创建文档碎片（collection reset时调用），以备一次性插入dom
		 * @param frag{documentFragment} 创建的文档碎片
		 * @memberOf BetView
		 * @name createFragment
		 */
		createFragment: function(frag){
			var data = this.model.toJSON(),
				domStr = this.template(data);
			this.$el.html(domStr);
			$(frag).append(this.$el);
		},
		_showDelete: function(e){
			var self = this;
			if(C.Config.platform == 'android'){
				self.longtaps = true;
				var self = this;
				
				window.cbox = new confirm.initialize({
					content: '删除单注?',
					onConfirm: function(){
						self._delete();
					},
					onCancel: function(){
						self.longtaps = false;
					}

				});

			}
		},
		/**
		 * 显示删除按钮
		 * @memberOf BetView
		 * @return void
		 */
		showDelete: function(){
			if(this.model.get('prevdel')){
				this.model.set({
					prevdel: false
				},{silent:true});
			}else{
				this.model.set({
					prevdel: true
				},{silent:true});
			}
			
			this.$el.toggleClass('select');
			C.betapp.trigger('toggleDelAll');
		},
		/**
		 * 删除单条数据
		 * @memberOf BetView
		 * @name _delete
		 */
		_delete: function(e){
			if(e){
				e.stopPropagation();
				e.preventDefault();
			}
			this.model.destroy();
			C.betapp.trigger('toggleDelAll');
		},
		/**
		 * 移除单条数据视图
		 * @memberOf BetView
		 * @name remove
		 */
		remove: function(){
			var self = this;
			if(C.Config.platform === 'ios'){
				this.$el.addClass('delete');
			}
			
			_.delay(function(){
				self.$el.remove();
				C.shakeSelectscroll.refresh();
				C.betapp.guideShow().upFee();
			},300);
		},
		/**
		 * 编辑单注(主要是change hash，并操作C.Config.editModel)
		 * @memberOf BetView
		 */
		editSingle: function(e){
			//如果已经出发长按事件，则跳出代码片段
			if(this.longtaps) return;
			var obj = $(e.currentTarget) , step = '';
			if(obj.hasClass('select')) return;
			if(this.model.get('canEdit') === false){
				alert('此选号无法继续编辑',function(){},'提示');
				return;
			}
			var hash = location.hash ,
				typeId = hash.split('/')[0].replace('#!','');
			step = '/3';
			C.Config.editModel[this.model.get('key')] = _.clone(this.model.get('value'));
			//this.model.destroy();
			
			//added 10-23
			this.model.set({
				editing: true
			});
			this.model.save();
			C.Config.changeUrl('#!' + this.model.get('key').replace('_','/') + step);
		}
	});
	
	/**
	 * 投注应用视图
	 * @class BetApp
	 * @name BetApp
	 */
	var BetApp = Backbone.View.extend({
		el: '#betBasket',
		betno: 0,
		events: {
			'click #zhbt': 'zhbt',
			'click #cancel': 'cancel',
			'keyup #zh': 'upFee',
			'change #bt': 'upFee',
			'click #submit': 'submit',
			'click #delall': 'deleteAll',
			'click #extraInfo .s em': 'showTreaty',
			'click .siuCheck': 'toggleCheck',
			'touchstart .submitBtn a': 'taped',
			'touchend .submitBtn a': 'notap',
			'click .add': 'goChooseNo'
		},
		goChooseNo: function() {
			var hash = location.hash;
			if (!hash.match('fc3d')) {
				location.hash = '!ssq/common/3';
			} else {
				location.hash = '!fc3d/zhx/3';
			}
		},
		taped: function(e){
			var obj = $(e.currentTarget);
			obj.addClass('taped');			
		},
		notap: function(e){
			var as = this.$el.find('.submitBtn a');
			as.removeClass('taped');
		},
		toggleCheck: function(e){
			var obj =$(e.currentTarget);
			obj.toggleClass('selected');
		},
		showTreaty: function(){
//			if(C.Config.platform === 'ios'){
//				jfpal.navigation.pushWindow('treaty.html');
//			}else{
				localStorage.setItem('trigTreaty',location.href);
				C.Config.changeUrl('treaty.html');
//			}
		},
		deleteAll: function(e){
			e.preventDefault();
			this.collection.clear();
			this.trigger('toggleDelAll');
			this.cancel();
		},
		initialize: function(cfg){

			var self = this;
			cfg = $.extend({
				collection: {},
				key: 'ssq_common',
				title: '',
				addContinue: function(){}
			},cfg);
			this.guideShow();
			Tool.buildCfg.call(this,cfg);
			this.setKey().setStep(cfg.step).upManualHref();
			C.Config.setToolBar();
			
			//创建scrollview，并使用pulldown to random
			this.buildPullRandom();
                                      
            // 摇一摇
			if(navigator.accelerometer) {
				if( G_DeviceMotionHandler ) {
					navigator.accelerometer.clearWatch(G_DeviceMotionHandler);
				}
				G_DeviceMotionHandler = navigator.accelerometer.watchAcceleration(self.deviceMotionHandler.bind(this), function(){
                    }, {frequency: 250});
			}
			//创建自定义事件
			self.buildCustomEvent();
			self.fetchIssue();
			this.fee = $('#fee');
			this.bt = $('#bt');
			if (!localStorage.beishu) {
				localStorage.beishu = '1';
			}
			this.bt.val(localStorage.beishu);

			this.zh = $('#zh');
			this.agree = $('#agree');
		},
		//继续购买huidiao
		continueBuy: function(){
			var num = Tool.searchJSON(location.search).num;
			if(num && num.length > 6 && num.match(/\d+/gi).length > 0){
				this.addContinues(decodeURIComponent(num));	
			}			
		},
		buildCustomEvent: function(){
			_.extend(this,Backbone.Events);
			this.bind('toggleDelAll',this.toggleDelAll,this);
		},
		toggleDelAll: function(){
			if(this.collection.getPrevdelNo() > 0){
				$('#betScroll .prevShow').addClass('hidden');
				$('#delall').removeClass('hidden');
			}else{
				$('#betScroll .prevShow').removeClass('hidden');
				$('#delall').addClass('hidden');
			}
			
		},
		last_x: 0,
		last_y: 0,
		last_z: 0,
		lastUpdate: 0,
		deviceMotionHandler: function(acceleration){
          if(G_INFRONT == false || G_INPAY == true) {

            return;
          }
			if($('#betBasket').length == 0) {
				return;
			}
          
			var self = this;
			var SHAKE_THRESHOLD = 400;
			var x, y, z;
			var curTime = new Date().getTime();
			if((curTime - this.lastUpdate) > 100) {
				var diffTime = (curTime - this.lastUpdate);
				this.lastUpdate = curTime;
				x = acceleration.x;
				y = acceleration.y;
				z = acceleration.z;
				var speed = Math.abs(x + y + z - this.last_x - this.last_y - this.last_z) / diffTime * 10000;
				if(speed > SHAKE_THRESHOLD) {
					self.sharkTimer && clearTimeout(self.sharkTimer);
                    
					self.sharkTimer = setTimeout(function(){
						if(speed > SHAKE_THRESHOLD) {
							self.sharkTimer && clearTimeout(self.sharkTimer);
							self.collection.random();
                                                 navigator.notification.vibrate(500);
						}
					},450);
				}
				this.last_x = x;
				this.last_y = y;
				this.last_z = z;
			}
		},
		/**
		 * 获取彩期数据
		 * @name fetchIssue
		 * @memberOf BetApp
		 */
		fetchIssue: function(){
              var url = '';
              var postData = {
                  application: C.Config.getIssueDataUrl(),
                  mobile: context.user.mobileNo
	              //t: new Date().getTime()
              };
              jfpal.safeAjax(url, postData, this.handleIssue.bind(this), function() {
              	  alert('请检查当前网络');
              });
		},
		/**
		 * 管理彩期数据
		 * @name handleIssue
		 * @memberOf BetApp
		 */
		handleIssue: function(data){
            var lotType = C.Config.lotTypeNumberId[C.Config.key.split('_')[0]];
			if(data.respCode == "0000"){
				$('#submit').removeClass('disabled');
                $('#submit').removeClass('issueOver');
				if(data.resultBean.length > 0){
                      var lo = _.find(data.resultBean, function(a){ return a.lotteryId == lotType; });
                      // 投注关闭时间
                      var endTime = lo.endBettingTime;
                      // new Date(yyyy,mth,dd,hh,mm,ss)
                      var tmpDate = endTime.split(" ");
                      var tmpDate1 = tmpDate[0].split("-");
                      var tmpDate2 = tmpDate[1].split(":");
                      var endDate = new Date(tmpDate1[0],tmpDate1[1] - 1, tmpDate1[2], tmpDate2[0], tmpDate2[1], tmpDate2[2]);
                      // 倒计时
                      C.Template.stopCountDownFlag && window.clearInterval(C.Template.stopCountDownFlag);
                      C.Template.stopCountDownFlag = window.setInterval(function() {
                                          C.Template.showTime(endDate)
                                      }, 1000);
                      // C.Template.showTime(endDate);
					  //此属性在投注使用，比如验证彩期是否过期、提交追号彩期列表
					  this.issueObj = _.clone(lo);
				}else{
					$('#submit').addClass('issueOver');
				}
			}
		},
		/**
		 * 拉取机选一注
		 * @memberOf BetApp
		 */
		pull: function(){
			var self = this;
			var istop = C.shakeSelectscroll.y >= 50 ? true : false;
			_.delay(function(){
				istop && self.collection.random();
			},100);
		},
		/**
		 * 一次性把文档碎片插入dom
		 * @param frag{docmentFragment} 创建的文档碎片，此时已插入信息列表
		 * @name oneTimePush
		 * @memberOf BetApp
		 */
		oneTimePush: function(frag){
			var selectList  = $('#selectList');
			selectList.append(frag);
			C.betapp.guideShow().upFee();
			C.shakeSelectscroll.refresh();
		},
		/**
		 * 构建pulldown to refresh
		 * @name buildPullRandom
		 * @memberOf BetApp
		 */
		buildPullRandom: function(){
			var self = this;
			this.g = $('#shakeSelect .tip s');
			this.s = $('#shakeSelect .tip span');
			Layout.setBetRegion().singleScroll('shakeSelect',{
				 //监测scroll时
				 onScrollMove: function(){
					 var that = this;
					 self.timer && clearTimeout(self.timer);
					 self.timer = setTimeout(function(){
						 if(that.y >= 50){
							 self.g.addClass('rotate');
							 self.s.html('松开即可机选...');
						 }else{
							 self.g.removeClass('rotate');
							 self.s.html('下拉可以机选...');
						 }
					 },20);
				 },
				 //监测手指离开触摸屏
				 onTouchEnd: function(){
					 self.pull();	
				 },
				 //监测scroll结束
				 onScrollEnd: function(){
					 self.g.removeClass('rotate');
					 self.s.html('下拉可以机选...');
				 },
				hideScrollbar: true
			});
		},
		/**
		 * 显示追号倍投
		 * @memberOf BetApp
		 * @name zhbt
		 */
		zhbt: function(e){
			e.preventDefault();
			var obj = $(e.currentTarget),
				bet = this.betno;
			if(bet > 0){
				C.shakeSelectscroll.destroy();
				obj.addClass('hidden');
				$('#cancel').removeClass('hidden');
				$('#extraInfo').removeClass('hidden');
			}else{
				alert('请至少选择1注！',function(){},'提示');
			}
		},
		/**
		 * 取消追号倍投
		 * @memberOf BetApp
		 * @name cancel
		 */
		cancel: function(e){
			if(e){
				e.preventDefault();
			}
			var self = this;
			_.delay(function(){
				self.buildPullRandom();
				var obj = $('#cancel');
				obj.addClass('hidden');
				$('#zhbt').removeClass('hidden');
				$('#extraInfo').addClass('hidden');
				C.betapp.upFee();
			},100);
		},
		/**
		 * 更新手工选号的链接地址
		 * @memberOf BetApp
		 * return BetApp
		 */
		upManualHref: function(){
			this.setKey();
			$(this.el).find('.header h2').html(this.title);
			var href = '#!' + C.Config.key.replace('_','/') + '/3';
			$(this.el).find('.type').attr('href',href);
			return this;
		},
		/**
		 * 设置key值，用于玩法标识
		 * @memberOf BetApp
		 * return BetApp
		 */
		setKey: function(){
			C.Config.key = this.key;
			return this;
		},
		/**
		 * 保存当前step到配置项
		 * @memberOf BetApp
		 * @return BetApp
		 */
		setStep: function(step){
			C.Config.step = Number(step);
			return this;
		},
		/**
		 * 根据选号列表的数据量，决定显示或隐藏导选图
		 * @memberOf BetApp
		 * @return BetApp
		 */
		guideShow: function(status){
			var select = $('#selectList'),
				guide = $('#guide');
			//var hasLi = select.html().replace(/ +/gi,'').length > 1 ? true : false;
			var hasLi = select.find('li').length > 0 ? true : false;
			var winH = window.innerHeight,
				headH = $('.header').height(),
				bottH = $('.submitBtn').height();
			if(hasLi){
				//guide.addClass('hidden');
				guide.css('position', 'absolute');
//				$('#selectList').css('minHeight',winH - headH -bottH - 44 + 'px');
			}else{
				//guide.removeClass('hidden');
				guide.css('position', 'static');
				$('#selectList').css('minHeight',0);
			}
			
			return this;
		},
		/**
		 * 更新所需金额
		 * @name upFee
		 * @memberOf BetApp
		 * @return BetApp
		 */
		upFee: function(e){
			localStorage.beishu = this.bt.val();
			
			var betno = 0 , reg = /\D/gi;
			var bt = Number(this.bt.val());
			if(e){
				var _obj = $(e.currentTarget);
				_obj.val(_obj.val().replace(reg,''));
				if(_obj.attr('id') === 'zh'){
					if(_obj.val().length > 2){
						_obj.val(_obj.val().substring(0,2));
					}
				}
			}
			//倍投值不能超过此彩种设置的最大倍投数
			if(bt > this.collection.maxBt){
				this.bt.val(this.collection.maxBt);
			}
			
			for(var i=0,len=this.collection.models.length;i<len;i++){
				//如果是实例化colllection时，传进来的model ,忽略之
				if(this.collection.models[i].get('tempBox')){
					continue;
				}
				betno += this.collection.models[i].get('bet');
			}
			this.betno = betno;
			var fee = Number(this.bt.val()) * Number(this.zh.val()) * betno * 2;
			this.fee.html(fee);
			return this;
		},
		/**
		 * 等待提交界面
		 * @memberOf BetApp 
		 */
		waitSubmit: function(){
			Layout.buildMaskLayer();
			$('body').append('<div class="wait"><p>正在提交订单，请稍候</p></div>');
		},
		/**
		 * 移除等待提交界面
		 * @memberOf BetApp
		 * @name removeWait
		 */
		removeWait: function(){
			Layout.removeMaskLayer();
			$('.wait').remove();
		},
		/**
		 * 登陆后返回的页面，此时直接提交订单（已获sid）
		 * @name loadSubmit
		 * @memberOf BetApp
		 * @return void
		 */
		loadSubmit: function(){
			var obj = Tool.searchJSON(location.search),
				_url = '', 
				arr = [];
			
			//判断是否是登陆返回的页面
			if(obj.callback !== 'C.betapp.orderCallback'){
				return;
			}else{
				this.waitSubmit();
				for(var i in obj){
			  		if(i=='numberStrings'){
			  			arr.push(i + '=' + encodeURIComponent(C.betcollection.getNumberString()));
			  		}else{
			  			arr.push(i + '=' + obj[i]);
			  		}
				}
                  
                var url = '';
                var postData = {
	                application: C.Config.getBetUrl()
	                //typeId: lotType,
	                //callback: "C.betapp.handleIssue",
	                //t: new Date().getTime()
                };
                //jfpal.safeAjax(url, postData, this.handleIssue);
                                      
				//_url =  + '?' + arr.join('&');
                                      
                                      //alert(_url);
				//Tool.getScript(_url);
			}
		},
		/**
		 * 提交投注
		 * @memberOf BetApp
		 * @name submit
		 */
		submit: function(e){
			e.preventDefault();
			var checked = this.validate();
			if(checked !== true){
				alert(checked,function(){},'提示');
				return;
			}
			localStorage.setItem('betfrom',location.href);
			
			this.waitSubmit();
			var search = this.getFormFields();
			var url = '';
			var requestBean = [];
			
			var searchData = Tool.searchJSON(search);
			_.each(searchData, function(v, k){
				searchData[k] = unescape(v);
			});
			var bets = searchData.numberStrings;
			_.each(bets.split('&'),function(s){
				var b = s.split('#')[0], c = s.split('#')[1];
                   
                var betMode = "1";
                if (parseInt(c) > 1) {
                    betMode = "2";
                }
                   
                var betType = "1";
                // for fc3d
                if (searchData.lotteryId === "05") {
                   betType = parseInt(b.split(':')[1]) + 1;
                   b = b.split(':')[0];
                   b = b.replace(new RegExp('',"gm"), ' ');
                   b = b.trim();
                }
                   
				c = parseInt(c) * 2 * 100 * searchData.multiple + "";
				var pad = function (num, size) {
				    var s = "000000000000" + num;
				    return s.substr(s.length-size);
				}
				c = pad(c, 12);
                   
				requestBean.push(
					{"betNumber":b.replace(new RegExp(' ',"gm"), ',').replace(':', "|"),"multiple": searchData.multiple,"betType":betType + "", "betMode": betMode, "betAmt":c}
				);
			});
			
			var postData = {
				application: C.Config.getBetUrl(),
				mobileNo: context.user.mobileNo,
				periodId: searchData.issueId,
				lotteryId: searchData.lotteryId,
				bookPeriods: "0",
				totalAmt: "" + parseInt(searchData.totalFee) * 100,
				"certType": "",
				"realName": "",
				"certPid": "",
				"betData": JSON.stringify({ "requestBean": requestBean })
			};
//用户姓名	realName	An20	M		
//证件类型	certType	N2	M		01: 身份证
//证件号码	certPid	N40	M	
//期次	periodNo	N7	M		
//彩种编号	lotteryCode	N2	M		
//追号期数	superAddPeriods	N2	M		不追号、单次投注则填0
//总金额	totalAmount	N12	M		12位金额(不足左补0)
//单位：分
//投注请求数据类型	betDataType	An10	M		json或则是xml
//投注信息	betData		M		见16.3.3
//{"requestBean":[{"betNumber ":"01,02,03,04,05,06|07","multiple":"2","betType":"1"，"betMode ":"1"},{"betNumber ":"01,02,03,04,05,06|07,08","multiple":"2","betType":"2"，"betMode ":"1"}]}。
//requestBean中的信息如下:
//	betNumber:投注彩号（格式详见各彩种“游戏格式规范说明书”）
//multiple:投注倍数
//betType:投注玩法 (详见各彩种“游戏格式规范说明书”)
//betMode:方式玩法(详见各彩种“游戏格式规范说明书”，如：单式、复式等)
			//agree=1&lotteryTypeId=05&issueId=2012031&orderType=0&buyFrom=1&ttid=zfb001%23ios&multiple=1&totalNum=253&totalFee=506&
			//numberStrings=01%2023%2027%2029%2032%2033%3A15%2618%2019%2020%2025%2026%2027%2028%2032%2033%3A04%2005%2012&callback=C.betapp.orderCallback&token=
			jfpal.safeAjax(url, postData, this.orderCallback.bind(this), this.orderCallbackFailed.bind(this));
		},
        orderCallbackFailed: function(resp){
            var self = this;
            alert(resp.respDesc || '请检查当前网络');
            this.removeWait();
        },
		/**
		 * 订单回执
         06-03 16:12:52.930: I/test(17002): result json = {"sign":"3B347DBC7D43255AB300ECA10973D960","respCode":"0000","appUser":"JFPAL","dataType":"json","application":"SaveLotteryBetOrder.Rsp","resultBean":{"orderAmt":"000000001400","orderNo":"LTY201306031609120021"},"data":"{\"resultBean\":{\"orderNo\":\"LTY201306031609120021\",\"orderAmt\":\"000000001400\"}}","respDesc":"操作成功","mobileSerialNum":"8665530100192320000000000000000000000000","osType":"android2.3.6","clientType":"02","version":"2.0.3"}

		 * @name orderCallback
		 * @memberOf BetApp
		 */
		orderCallback: function(obj){
			var self = this;
                                      
			//如果返回错误代码
			if(obj.respCode != "0000"){
				//如果未登录
				if(obj.resultCode === 'ERR_LOGIN'){
					var search = this.getFormFields();
					C.Config._login();
				}else{
					var hash = location.hash;
					//跳转到异常处理页面
					C.Config.changeUrl(location.href.replace(hash,'') + '#!exception/' + obj.resultCode);
				}
			}else{
				if( Number( obj.resultBean.orderAmt ) != Number(this.fee.html()) * 100) {
					var hash = location.hash;
					//跳转到异常处理页面
					C.Config.changeUrl(location.href.replace(hash,'') + '#!exception/' + 'ERR_TOTALFEE');
					return;
				}
				C.Config.pay(obj.resultBean);
				//投注页面上其他处理
				C.betcollection.clear();
				this.removeWait();
				_.delay(function(){
					self.cutPageUrl();
				},2000);
				
			}
		},
		/**
		 * 精简成功提交彩票订单返回页面URL（主要清理url中的订单相关参数）
		 * @memberOf BetApp
		 * @name cutPageUrl 
		 */
		cutPageUrl: function(){
			C.Config.cutPageUrl();
		},
		/**
		 * js触发click事件
		 * @memberOf BetApp
		 * @name simulateClick 
		 * @param el{dom}  裸的dom元素
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
		        	alert(e,function(){},'提示');
		        };
			}else{
				el.click();
			}
		},
		/**
		 * 检测合法性
		 * @memberOf BetApp
		 * @name validate
		 * @return 
		 */
		validate: function(){
			var bet = this.betno;
			if($('#submit').hasClass('disabled')){
				return '尚未获取彩期，稍后再试!';
			}else if($('#submit').hasClass('issueOver')){
				return '本期已截期，请下期再投注!';
			}else if(bet == 0){
				return '请至少选择1注！';
			}else if(this.bt.val() == 0){
				return '倍投不能为空！';
			}else if(this.zh.val() == 0){
				return '请至少选择1期(即当前期)！';
			}else if(!this.agree.hasClass('selected')){
				return '你没有同意网上购彩协议！';
			}
			return true;
		},
		/**
		 * 整合提交订单的各字段值(忽略代购、合买、追号)
		 * @name getFormFields
		 * @memberOf BetApp
		 */
		getFormFields: function(){
			/**
			 * agree 是否同意购彩协议 , note: 1 ->同意	0 -> 不同意
			 * lotteryTypeId 彩种ID
			 * issueId 彩期ID ， note: xxxx -> 服务器端获取
			 * orderType 订单类型， note: 0 -> 代购	 1 -> 发起合买	2 -> 参与合买	3 -> 追号
			 * buyFrom 订单来源 note: 1 -> 无线
			 * ttid	固定字段	note: html5
			 * multiple 倍投
			 * totalNum 注数
			 * totalFee 金额
			 * numberStrings 选号格式 note：01 02 03 04 05 06:01&01 02 03 04 05 06:01
			 * callback jsonp回调，开发自定义
			 * sid 登陆后回调参数，用于验证用户登陆状态
			 */
			var numberStrings = encodeURIComponent(C.betcollection.getNumberString()),  //此处encode，解决投注号码字符串的'&'符
				agree = 1,
				lotteryTypeId = C.Config.lotTypeNumberId[C.Config.key.split('_')[0]],
				lotteryId = this.issueObj.lotteryId,
				issueId = this.issueObj.periodId,
				orderType = 0,
				buyFrom = 1,
				ttid = C.Config.ttid(),
				multiple = this.bt.val(),
				totalNum = this.betno,
				totalFee = this.fee.html();
			
			//支付宝客服端用户验证字段
			if(typeof jfpal !== 'undefined'){
			    var token = context.user.token;
			    
			}else{
			    var token = '';
			}
			//var token = '9113bd88e8a5fc35b3d4c184cc3ca554';
			//代购
			if(this.zh.val() == 1){
				return '?agree=' + agree + '&lotteryId='+lotteryId+'&lotteryTypeId=' + lotteryTypeId + '&issueId=' + issueId + '&orderType=' + orderType + '&buyFrom=' + buyFrom + '&ttid=' + ttid  + '&multiple=' + multiple + '&totalNum=' + totalNum + '&totalFee=' + totalFee + '&numberStrings=' + numberStrings + '&callback=C.betapp.orderCallback&token=' + token;
			}else{  //追号
				/**
				 * 增加追号字段
				 */
                console.log("追号");
				var zNo = Number(this.zh.val()) , singleIssueMoney = totalNum * multiple * 2;
                                      var maxZh = 1; //this.issueObj.results[0].pursueNumberIssues.length;
				if(zNo > maxZh){
					this.removeWait();
					alert('当前最多可追' + maxZh + '期',function(){},'提示');
					return false;
				}
				var pursueIssueArr = [] , pursueMultiArr = [] , pursueMoneyArr = [] ,curIssueId = Number(this.issueObj.periodNo);
				for(var i = 0;i < zNo; i++){
					pursueIssueArr.push(this.issueObj.periodNo);
					pursueMultiArr.push(multiple);
					pursueMoneyArr.push(singleIssueMoney);
				}
				var pursueIssueList = pursueIssueArr.join(';'), 
					pursueMultiList = pursueMultiArr.join(';'), 
					pursueMoneyList = pursueMoneyArr.join(';'),
					pursueIssueCount = zNo,
					stopPursue = $('#afterLuckyStop').hasClass('selected') == true ? 1 : 0,
					orderType = 3;
				return '?agree=' + agree + '&lotteryId=' + lotteryId + '&lotteryTypeId=' + lotteryTypeId + '&pursueIssueList=' + pursueIssueList + '&pursueMultiList=' + pursueMultiList + '&pursueMoneyList=' + pursueMoneyList + '&pursueIssueCount=' + pursueIssueCount + '&stopPursue=' + stopPursue + '&issueId=' + issueId + '&orderType=' + orderType + '&buyFrom=' + buyFrom + '&ttid=' + ttid  + '&multiple=' + multiple + '&totalNum=' + totalNum + '&totalFee=' + totalFee + '&numberStrings=' + numberStrings + '&callback=C.betapp.orderCallback&token=' + token;
			}
		}
	});

	return {
		Model: BetModel,
		Collection: BetCollection,
		App: BetApp
	};
});


