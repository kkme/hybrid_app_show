/**
 * @fileoverview  布局管理
 * @dependencise: iscroll
 */

/**
 * 声明布局模块
 */
define(function(require, exports) {
    /**
     * 返回外部调用接口
     */
    return {
		initialize: function() {},
		errorLoginException: function(obj) {
			//var url = C.Config.getLoginUrl() + '?TPL_redirect_url=' + encodeURIComponent(location.href);
			obj.exception('请重新 <a href="#" onclick="jfpal.login();location.reload();">登录</a>');
		},
		continueBuy: function() {},
        // 未付款订单 立即付款
		pay: function(model, node) {
       
           if(typeof jfpal !== 'undefined'){
               jfpal.jfPay(
                              {
                              "merchantId": "0004000002",
                              "merchantName": '彩票',
                              "productId": '0000000000',
                              "orderAmt": model.orderAmt * 100 + "",
                              "orderDesc": model.orderNo,
                              "orderRemark": "1"
                              },
                              function(o){
                              console.log("ERROR: model.js Line36. ");
                          },function(){
                              console.log("ERROR: model.js Line36. ");
                              });
           }

			this._payNode = node.next();
		},
		setToolBar: function() {},
		back: function() {},
		handleJfpal: function(data) {
			this._payNode.attr('href', C.Config.getPayUrl() + '?jfpal_trade_no=' + data.jfpalTradeNo + '&s_id=' + C.Config.data_user);
			C.Tool.simulateClick(this._payNode);
		}
    };
});
