
/*
 *	客户端交互接口
 */

define(function(require, exports) {
	$('.leftButton').on('tap', function() {
		C.Config.leftBar();
	});
	var Mode = require('./mode');
	/*var platform = (function(){
		var useragent = navigator.userAgent.toLowerCase();
		if(useragent.indexOf('android') >= 0){
			return 'android';
		}else if(useragent.indexOf('iphone') >= 0 || useragent.indexOf('ipad') >= 0 || useragent.indexOf('ipod') >= 0){
			return 'ios';
		}else{
			return 'other';
		}
	})();*/
	
	return $.extend(Mode, {
		initialize: function() {
			window['setToolBar'] = function(){
				//动态设置toolbar上按钮文案
				var key = C.Layout._key,
					centerStr = '', rightStr = '';
				if (key === 'list')	{
					centerStr = '我的订单';
				} else {
					centerStr = '订单详情';
                    // jfpal.navigation.hideRightButton();
                    $('.rightButton').text('').css('visibility', 'hidden');
//					rightStr = '继续购买';
//                    jfpal.navigation.setupRightButton(rightStr, "v2_right_add_normal.png", function() {
//                        C.Mode.rightBar();
//                    });
				}

    //             jfpal.navigation.setupLeftButton("返回", "", function() {
    //                C.Config.leftBar();
    //             });
                
    //             jfpal.navigation.show();
				// jfpal.navigation.setTitle(centerStr);
				$('.navTitle').text(centerStr);
			};
                    
			//重设配置项
			C.Config = $.extend(C.Config , {
				data_user: context.user.token,
				data_username: 'token',
				leftBar: function() {
		            if (C.Layout._key === 'detail') {
		                    history.back();
		            } else {
		                    C.Tool.navigate(null,'../../index-alipay-native.html');
		            }
		        },
			});
			
			//webview无法操作location.href
			C.Tool = $.extend(C.Tool , {
				navigate: function(router, url, tag) {
					var aNode = $('#navigate'),
						href = '';
					if (!aNode.length) {
						aNode = $('<a>');
						aNode.attr({'class': 'hidden', 'id': 'navigate'});
						$('body').append(aNode);
					} 	
					
					href = (router === null) ? url : location.href.split('#!')[0] + '#' + url;	
					aNode.attr('href', href);
					this.simulateClick(aNode[0]);
				}
			});
		},
        
        rightBar: function() {
            var model = C.OrderDetail.model.toJSON(),
            arr = [],
            lotteryType = model.lotteryType,
            route = C.Mode.getRoute(lotteryType);
            if (!C.Template.lotteryTypeMap[lotteryType].isShowSport) {
            _.each(model.orderNumber, function(order) {
                   if (order.ConLNV && order.ConLNV.length > 0) {
                   arr.push(order.ConLNV.join('&'));
                   }
                   });
            }
            
            if (lotteryType === 21)	{
            C.Tool.navigate(null,'../../jczq.html');
            } else if (lotteryType === 20)	{
            C.Tool.navigate(null,'../../jclq.html');
            } else if (lotteryType === 16)	{
            C.Tool.navigate(null,'../../zqdc.html');
            } else if (route === '') {
            C.Tool.navigate(null,'../../index-alipay-native-app.html');
            } else {
            C.Tool.navigate(null,'../../index-alipay-native-app.html?num=' + encodeURIComponent(arr.join('&')) + route);
            }
        },
		handleJfpal: function(data) {
			if (!data.status) {
				alert(data.resultMessage, function(){}, '提示');
				return;
			}
                    
			jfpal.jfPay(
                           {
                           "merchantId": "0004000002",
                           "merchantName": '彩票',
                           "productId": '0000000000',
                           "orderAmt": data.orderAmt,
                           "orderDesc": data.orderNo.replace(/,/gi,';'),
                           "orderRemark": "1"
                           },
                           this.payCallback,this.payCallback);
		},
		payCallback: function(data) {
			if (data.status == 'no') {
				//alert(data.memo, function(){}, '提示');
			}
			location.reload();
		},
		setToolBar: function() {
			window.setToolBar();
		},
		getRoute: function(type) {
			var route = '';
			switch (type) {
				case 01 :
					route = '#!ssq/bet/2';
					break;
				case 8 :
					route = '#!dlt/bet/2';
					break;
				case 05 :
					route = '#!fc3d/zhx/bet/2';
					break;
				case 7 : 
					route = '#!qlc/bet/2';
					break;
				case 10 :
					route = '#!swxw/bet/2';
					break;
				case 14:
					route = '#!xssc/x3zhx/bet/2';
					break;
				case 15:
					route = '#!syy/rx5/bet/2';
					break;
				default : 
					break;
			};
			return route;
		}
	}); 
});
