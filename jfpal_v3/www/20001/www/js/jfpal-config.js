
define(function(require,exports){
	// 前进后退
	if (device.platform == 'iOS') {
        $('.leftButton').on('tap', function() {
			C.Config.leftBar();
		});
    } else if (device.platform == 'Android') {
        document.addEventListener('backbutton', function() {
			C.Config.leftBar();
		}, false);
    }
	$('.rightButton').on('tap', function() {
		C.Config.rightBar();
	});	

	if(navigator.notification){
		window.alert = navigator.notification.alert;
	}

	C.Config = $.extend(C.Config,{
		setRLRightBar: function(type){
			if(_.indexOf(C.Config.doneLot,Number(type)) >= 0){
                typeof jfpal !== 'undefined' && jfpal.navigation.setRightItemTitle('购买');
			}else{
				typeof jfpal !== 'undefined' && jfpal.navigation.setRightItemTitle('');
			}
		},
		getMyOrderUrl: function(){
			return 'orderapp/demo/jfpal.html';
		},
		/**
		 * 跳到我的订单页
		 */
		gotoOrder: function(obj,sid,e){
			this.changeUrl(this.getMyOrderUrl());
			e.preventDefault();
		},
		ttid: function(){
			var str = '',
				plat = this.platform;
    		if(plat === 'ios'){
    			str = 'zfb001#ios';
    		}else if(plat === 'android'){
    			str = 'zfb001#android';
    		}
    		return encodeURIComponent(str);
		},
		simulateDom: document.getElementById('simulateDom'),
		leftBar: function(){
			var arr = location.hash.split('/'),
				search = location.search,
				hash = location.hash,
				step = Number(arr[arr.length - 1]);
			//聚合页
			if(step === 0 || step === 1){
				context.quit();
			}else if(step === 2){
				//投注页
				var url = '#!nav/1';
				this.changeUrl(url);
			}else if(step === 3){
				//如果开奖公告列表(多彩种)
				if(/^#!reward\/list/i.test(location.hash)){
					var url = '#!reward/2';
				}else if(/^#!newuser\//i.test(location.hash)){
					var url = localStorage.getItem('betfrom');
				}else{
					//手动选号盘
					var l = this.key.split('_')[0] + this.key.split('_')[1];
					if(C[l + 'ballcollection']){
						C[l + 'ballcollection'].clear();
					}
					var url = this.abacusBetMap[this.key];
				}
				this.changeUrl(url);
			}else if(/^#!exception/i.test(location.hash)){
				//异常页
				var url = '#!nav/1';
				this.changeUrl(url);
			}
		},
		rightBar: function(){
			var arr = location.hash.split('/'),
				search = location.search,
				hash = location.hash,
				step = Number(arr[arr.length - 1]);
			//聚合页
			if(step === 0 || step === 1){
				//location.reload();
			}else if(step === 2){
				//投注页
				var url = this.keyAbacusMap[this.key];
				this.changeUrl(url);
			}else if(step === 3){
				//公告列表
				if(/^#!reward\/list/i.test(location.hash)){
					var type = location.hash.split('/')[2];
					var t = '', _hash = '';
					for(var i in C.Config.lotTypeNumberId){
						if(type == C.Config.lotTypeNumberId[i]){
							t = i;
						}
					}
					for(var j in C.Config.abacusBetMap){
						if(j.indexOf(t) === 0){
							_hash = C.Config.abacusBetMap[j];
						}
					}
					if(_hash.indexOf('fc3d') >= 0){
						this.changeUrl('#!fc3d/zhx/bet/2');
						return;
					}else if(_hash.indexOf('xssc') >= 0){
						this.changeUrl('#!xssc/x3zhx/bet/2');
						return;
					}else if(_hash.indexOf('xssc') >= 0){
						this.changeUrl('#!syy/rx5/bet/2');
						return;
					}
					
					this.changeUrl(_hash);
				}else{
					//手动选号盘
					var url = this.abacusBetMap[this.key];
					
					//验证是否满足选号规则
					var l = this.key.split('_')[0] + this.key.split('_')[1] , 
						v = true;
					for(var i in C){
						if(i == l + 'ballcollection'){
							v = C[i].verify();
						}
					}
					if(v !== true){
						alert(v,function(){},'提示');
						return false;
					}
					this.changeUrl(url);
				}
				
			}
		},
		/**
		 * 是否先提示探测本地数据
		 */
		tipDetect: false,
		/**
		 * 使用于客户端
		 */
		changeUrl: function(url){
			this.simulateDom.href = url;
			this.simulateClick(this.simulateDom);
		},
		/**
		 * 动态设置toolbar上的按钮文案
		 */
		setToolBar: function(){
			//动态设置toolbar上按钮文案
			var self = this , centerStr = '' , rightStr = '';
			var arr = location.hash.split('/'),
				step = Number(arr[arr.length - 1]);
			//聚合页
			if(step === 0 || step === 1){
				centerStr = '彩票';
				//rightStr = '刷新';
				rightStr = '';
			}else if(step === 2){
				//如果开奖公告
				if(/^#!reward/i.test(location.hash)){
					centerStr = '开奖公告';
					rightStr = '';
					$('.rightButton').css('visibility', 'hidden');
				}else{
					//投注页
					centerStr = self.lotNameMap[self.key.split('_')[0]];
					rightStr = '手选';
					$('.rightButton').css('visibility', 'visible');
				}
			}else if(step === 3){
				//开奖公告列表
				if(/^#!reward\/list/i.test(location.hash)){
					var lotnum = location.hash.split('/')[2];
					for(var i in C.Config.lotTypeNumberId){
						if(C.Config.lotTypeNumberId[i] == lotnum){
							var lotname = C.Config.lotteryTypeHash[i];
						}
					}
					centerStr = lotname;
					rightStr = '';
				}else if(/^#!newuser/i.test(location.hash)){
					centerStr = '领奖人信息';
					rightStr = '';
				}else{
					rightStr = '完成';
					//手选页
					centerStr = self.lotNameMap[self.key.split('_')[0]];
					
				}
			}else if(/^#!exception/i.test(location.hash)){
				//异常处理页面
				centerStr = '彩票';
				rightStr = '';
			}
			if(typeof jfpal !== 'undefined'){
				$('.navTitle').text(centerStr);
				$('.rightButton').text(rightStr);
			}
		},
		/**
		 * 支付接口
		 * @param obj{object} 服务器返回的数据json
		 */
		pay: function(obj){
			var self = this;
			if(typeof jfpal !== 'undefined'){
                         //merchantId=%@&merchantName=%@&productId=%@&orderAmt=%d&orderDesc%@=&orderRemark=1
				jfpal.jfPay(
                               {
                                "merchantId": "0004000002",
                                "merchantName": '彩票',
                                "productId": '0000000000',
                                "orderAmt": obj.orderAmt,
                                "orderDesc": obj.orderNo,
                                "orderRemark": "1"
                               },
                               function(o){
					self.changeUrl('index-alipay-native-app.html');
				},function(){});
			}
		},
		/**
		 * 检测用户登陆状态
		 */
		checkLogin: function(){
			return context.isLogin;
		},
		cutPageUrl: function(){},
		_login: function(){
			jfpal.login();
			location.reload();
		}
		
	});
});
