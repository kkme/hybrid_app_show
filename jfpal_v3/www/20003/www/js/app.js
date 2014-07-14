//backbone router模块定义
define(function(require, exports, module) {
    //加载导航栏所依赖模块
    require('./config');
    require('./jfpal-config');

    (function() {
        if (device.platform == 'Android') {
            $('nav, #trolley_layer, #steps').addClass('android');
            $('#loading').addClass('android').height($('body').height() - 46);
        } else if (device.platform == 'iOS') {
            $('.leftButton').removeClass('hide');
            if (device.version.indexOf('7') != 0) {
                $('nav, #trolley_layer, #steps').addClass('notIOS7');
                $('#loading').addClass('notIOS7').height($('body').height() - 46);
            } else {
                $('#loading').height($('body').height() - 66);
            }
        }

        // 替换web的弹框为本地弹框
        window.alert = navigator.notification.alert;
        window.confirm = navigator.notification.confirm;
        
        new FastClick(document.body); // 消除click事件在触摸UI上的点击延迟
    }());

    //App Router控制器
    var AppRouter = Backbone.Router.extend({
    	routes: {
    		'': 'findWeidian',
            '!findWeidian/:step': 'findWeidian',
            '!enterWeidian/:step': 'enterWeidian',
    		'!settlement/:step': 'settlement'
    	},

    	findWeidian: function(step) {
    		// require.async('./nav', function(nav) {
                // step = step || '';
    		// 	nav.init(step);
    		// });

    		require.async('./visitWeidian/findWeidian', function(findWeidian) {
                 step = step || '';
                 findWeidian.init(step);
    		});
    	},

        enterWeidian: function(step) {
            // require.async('./nav', function(nav) {
            //     nav.init(step);
            // });

            require.async('./visitWeidian/enterWeidian', function(enterWeidian) {
                 enterWeidian.init(step);
            });
        },

        settlement: function(step) {
            require.async('./nav', function(nav) {
                nav.init(step);
            });

            require.async('./visitWeidian/settlement', function(settlement) {
                 settlement.init(step);
            });
        }
    });

    window['app_router'] = new AppRouter;
    Backbone.history.start();
});