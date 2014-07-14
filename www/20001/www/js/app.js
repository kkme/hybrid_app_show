//backbone router模块定义
define(function(require, exports, module) {
    //加载导航栏所依赖模块
    require('./config');
    require('./jfpal-config');

    (function() {
        if (device.platform == 'Android') {
            $('nav').addClass('android');
        } else if (device.platform == 'iOS') {
            $('.leftButton').removeClass('hide');
            if (device.version.indexOf('7') != '0') {
                $('nav').addClass('notIOS7');
            }
        }
    }());

    //App Router控制器
    var AppRouter = Backbone.Router.extend({
    	routes: {
    		'': 'index'
    	},

    	index: function(step) {
            var step = step || '';
    		require.async('./nav', function(nav) {
                nav.init(step);
            });
    	}
    });

    window['app_router'] = new AppRouter;
    Backbone.history.start();
});