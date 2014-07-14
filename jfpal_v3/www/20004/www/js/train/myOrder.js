define(function(require) {
    var curStep; // 哪个页面跳转到此页面的标志位

    var MyOrders = Backbone.Collection.extend({
        postData: null,
        sync: function() {
            this.initPostDate(); // 初始化日期数据
            var self = this;                                
            jfpal.safeAjax('', this.postData, function(data) {
                if (!data.resultBean) {
                    self.goBackUrl();
                    $('#loading').fadeOut(200, function() {
                        alert('无购票记录', function() {}, '提示', '确定');
                    });
                } else {
                    self.reset(arr);
                    require.async('../nav', function(nav) {
                        nav.init(curStep);
                    });
                    $('#loading').fadeOut(200);
                }
            }, function(error) {
                self.goBackUrl();
                $('#loading').fadeOut(200, function() {
                    alert(error.msg, function() {}, '提示', '确定');
                });
            });
        },
        //格式化日期
        formatDate: function(date) {
            var sYear = date.getFullYear(),
                sMonth = (date.getMonth() + 1),
                sDate = date.getDate();
                                               
            sMonth = (sMonth < 10) ? ('0' + sMonth) : sMonth;
            sDate = (sDate < 10) ? ('0' + sDate) : sDate;
                                               
            var sDate = sYear + '-' + sMonth + '-' + sDate;

            return sDate;
        },
        // 初始化safeAjax的数据
        initPostDate: function() {
            var now = new Date();
            var beginDate = this.formatDate(now);
            var endDate = now.setDate(now.getDate() + 30) + '';

            this.postData = {
                application: 'GetHistoryOrderList',
                beginDate: beginDate,
                endDate: endDate,
                mobileNo: context.user.mobileNo,
                page: '',
                pageSize: ''
            }
        },
        // 数据请求失败后，改回原来的hash值
        goBackUrl: function() {
            app_router.navigate('!index', {trigger: false});
        }
    });
       
    var MyOrderView = Backbone.View.extend({
        el: '#myOrder',

        collection: new MyOrders(),
                                           
        initialize: function() {
            var self = this;
            this.collection.on('reset', function() {
                self.render();
            });
        },

        template: function(data) {
            var temp = _.template($('#myOrder_tpl').html(), {data: data});
            return temp;
        },

        render: function() {
            $('#myOrder').html(this.template(this.collection.toJSON()));
        }
    });

    var myOrderView = new MyOrderView();
       
    return {
        init: function(step) {
            $('#loading').fadeIn(200);
            curStep = step; // 初始化相关数据
            myOrderView.collection.fetch();
        }
    };
});