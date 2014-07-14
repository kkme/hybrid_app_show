//导航模块定义
define(function(require, exports) {
    // 计算是否是第一次进入首页  
    var isFirst = 1;
       
    return {
    	init: function(step, title) {
            var hash = location.hash;

            C.Config.setToolBar(hash, step, title);
        }
    };
});