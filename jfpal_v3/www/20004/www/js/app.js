//backbone router模块定义
define(function(require, exports, module) {
    //加载导航栏所依赖模块
    require('./config');
    require('./jfpal-config');

    (function() {
        if (device.platform == 'Android') {
            $('nav, #steps, .top-bar').addClass('android');
            $('#loading').height($(window).height() - 46); // 设置此页等待层的高度
            window.pFlag = 'android'; // 平台标志位
        } else if (device.platform == 'iOS') {
            $('.leftButton').removeClass('hide');
            if (device.version.indexOf('7') != 0) {
                $('nav, #steps, .top-bar').addClass('notIOS7');
                $('#loading').height($(window).height() - 46); // 设置此页等待层的高度
            } else {
                $('#loading').height($(window).height() - 66); // 设置此页等待层的高度
            }
            window.pFlag = 'ios'; // 平台标志位
        }

        // 弹出等待层时，禁止滚动
        $(window).on('touchmove', function(e) {
            if ($('#loading').css('display') == 'block') {
                e.preventDefault();
            }
        });

        // 替换web的弹框为本地弹框
        window.alert = navigator.notification.alert;
        window.confirm = navigator.notification.confirm;
        // 创建全局对象dT,方便在各个view之间传递数据
        window.dT = {
            // 车站页传回首页的参数
            station: {
                dep_station: '',
                des_station: ''
            },
            // 首页传到车票查询页参数
            queryTicket: {
                application: 'GetTrainNumberInfo',
                outCity: '',
                arrCity: '',
                outDate: '',
                trainType: '',
                timeQuantum: '',
                trainNo: '',
                page: '',
                mobileNo: context.user.mobileNo
            },
            // 车票查询页传到车票预定页参数
            tic_res: {
                train_no: '',
                train_type: '',
                dep_station: '',
                arr_station: '',
                go_time: '',
                to_time: '',
                current_time: '',
                insure_cost: '',
                seat: []
            },
            // 乘客列表页传到新增乘客页或修改乘客信息页参数
            pas_info: {
                c_name: '',
                mobile_no: '',
                pid_type: '',
                pid: '',
                c_id: '',
                sex: ''
            },
            // 乘客列表页传到车票预定页参数
            passe_info: {}
        };
    }());

    //App Router控制器
    var AppRouter = Backbone.Router.extend({
    	routes: {
    		'': 'index',
            '!index/:step': 'index',
    		'!tip/:step': 'showTip',
            '!city/:step': 'showCity',
            '!myOrder/:step': 'showMyOrder',
            '!queryTicket/:step': 'showQueryTicket',
            '!writeOrder/:step': 'showWriteOrder',
            '!addPassenger/:step': 'showAddPassenger',
            '!new_pas/:step': 'showNewPassenger'
    	},

    	index: function(step) {
            var step = step || '';
    		require.async('./train/step1', function(step1) {
                step1.init(step);
    		});
    	},

        showTip: function() {             
            require.async('./nav', function(nav) {
                nav.init();
            });                         
        },
                                           
        showHistory: function() {
            require.async('./nav', function(nav) {
                nav.initialize('history');
            });
                                           
            require.async('./train/history', function(history) {
                history.init();                                      
            });
        },
                                           
        showCity: function(step) {                               
            require.async('./train/city', function(city) {
                city.init(step);
            });
        },

        showMyOrder: function(step) {       
            require.async('./train/myOrder', function(myOrder) {
                myOrder.init(step);
            });
        },
                                           
        showQueryTicket: function(step) {                               
            require.async('./train/queryTicket', function(queryTicket) {
                queryTicket.init(step);
            });
        },

        showWriteOrder: function(step) {       
            require.async('./train/writeOrder', function(writeOrder) {
                writeOrder.init(step);
            });
        },

        showAddPassenger: function(step) {
            require.async('./train/addPassenger', function(addPassenger) {
                addPassenger.init(step);
            });
        },

        showNewPassenger: function(step) {
            require.async('./train/new_pas', function(new_pas) {
                new_pas.init(step);
            });
        }
    });

    window['app_router'] = new AppRouter;
    Backbone.history.start();
});