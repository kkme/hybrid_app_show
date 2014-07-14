//backbone router模块定义
define(function(require, exports, module) {
    //加载导航栏所依赖模块
    require('./config');
    require('./jfpal-config');

    (function() {
        if (device.platform == 'Android') {
            $('nav, #steps').addClass('android');
            $('#loading').addClass('android').height($('body').height() - 46);
        } else if (device.platform == 'iOS') {
            $('.leftButton').removeClass('hide');
            if (device.version.indexOf('7') != 0) {
                $('nav, #steps').addClass('notIOS7');
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
    		'!myWeidian/:step': 'showWeidian',
            '!shopEidt/:step': 'showShopEdit',
            '!pubGoods/:step': 'showGoods',
            '!pub_goods_details/:step': 'showPubGoodsDetails',
            '!goods_sort/:step': 'showGoodsSort',
            '!goods_library/:step': 'showGoodsLibrary'
    	},

        showWeidian: function(step) {
            // require.async('./nav', function(nav) {
            //     nav.init(step);
            // });

            require.async('./weidian/myWeidian', function(myWeidian) {
                 myWeidian.init(step);
            });
        },

        showShopEdit: function(step) {
            require.async('./nav', function(nav) {
                nav.init(step);
            });

            require.async('./weidian/shopEidt', function(shopEidt) {
                 shopEidt.init(step);
            });
        },

        showGoods: function(step) {
            // require.async('./nav', function(nav) {
            //     nav.init(step);
            // });

            require.async('./weidian/pubGoods', function(pubGoods) {
                 pubGoods.init(step);
            });
        },

        showPubGoodsDetails: function(step) {
            // require.async('./nav', function(nav) {
            //     nav.init(step);
            // });

            require.async('./weidian/pubGoodsDetails', function(pubGoodsDetails) {
                 pubGoodsDetails.init(step);
            });    
        },

        showGoodsSort: function(step) {
            // require.async('./nav', function(nav) {
            //     nav.init(step);
            // });

            require.async('./weidian/goodsSort', function(goodsSort) {
                 goodsSort.init(step);
            });
        },

        showGoodsLibrary: function(step) {
            // require.async('./nav', function(nav) {
            //     nav.init(step);
            // });

            require.async('./weidian/goodsLibrary', function(goodsLibrary) {
                 goodsLibrary.init(step);
            });
        }
    });

    window['app_router'] = new AppRouter;
    Backbone.history.start();
});