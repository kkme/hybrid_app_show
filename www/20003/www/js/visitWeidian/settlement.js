define(function(require) {
    var apiUrl = require('../apiConfig');

    var detail = [];
    var amount;
    var pId;

    var OrderInfo = Backbone.Model.extend({
        url: apiUrl.addr + '?r=store.order.submit',
        sync: function() {
            console.log(amount);
            var self = this;
            $.ajax({
                url: this.url,
                type: 'post',
                data: {
                    mobile_no: sessionStorage.mobile_no,
                    payer_id: context.user.mobileNo,
                    detail: JSON.stringify(detail),
                    amount: amount
                },
                success: function(data) {
                    if (data.success) {
                        $('#loading').fadeOut(200);
                        self.requestOrder(data.order);
                        console.log(data.order);
                    } else {
                        $('#loading').fadeOut(200, function() {
                            alert(data.msg, function() {}, '提示', '确定');
                        });
                    }
                },
                error: function() {
                    $('#loading').fadeOut(200, function() {
                        alert('请检查当前网络', function() {}, '提示', '确定');
                    });
                }
            });
        },
        requestOrder: function(data) {
            jfpal.jfPay({
                "needHandsign": '1',
                "merchantId": "0002000002",
                "merchantName": '福店',
                "productId": pId, //0000000001
                "orderAmt": (data.amount * 100).toFixed(0) + '',
                "orderDesc": sessionStorage.mobile_no, //微店主手机号
                "orderRemark": sessionStorage.flagshipId + "#" + data.id //flagship_id#order_id
            });
        }
    });
       
    var SettlementView = Backbone.View.extend({
        el: '#settlement',

        model: new OrderInfo(),

        initialize: function() {

        },

        template: function(data) {
            var temp = _.template($('#orderInfo_tpl').html(), {data: data});
            return temp;
        },

        shopTrl: '',
 
        render: function(data) {
            this.$('.last').html(this.template(data));
            this.shopTrl = data;
        },

        events: {
            'click .global_button': 'settle',
            'click .fourth span': 'chsStyle',
            'touchstart .global_button': 'taped',
            'touchend .global_button': 'notap',
            'touchstart .pub_goods': 'taped',
            'touchend .pub_goods': 'notap'
        },

        settle: function() {
            var i = 0;
            $.each(this.shopTrl, function(key, value) {
                detail[i] = [];
                detail[i][0] = value[0]['id'];
                detail[i][1] = value[0]['price'];
                detail[i][2] = value.length;
                i += 1;
            });
            $('#loading').fadeIn(200);
            this.model.save();
        },

        chsStyle: function(e) {
            var obj = $(e.target);
            obj.addClass('taped').siblings().removeClass('taped');
            if (obj.hasClass('right')) {
                pId = '0000000002';
                context.helpinfo('PersonalPayments.PayWayCommon', function(data){
                    $('.notice').html(data);
                });
            } else {
                pId = '0000000000';
                context.helpinfo('PersonalPayments.PayWaySuper', function(data){
                    $('.notice').html(data);
                });
            }
        },

        taped: function(e) {
        	var obj = $(e.target);
        	obj.addClass('taped');
        },

        notap: function(e) {
        	var obj = $(e.target);
        	obj.removeClass('taped');
        }
    });

    var settlementView = new SettlementView();

    return {
        init: function(step) {
            amount = sessionStorage.amount;
            $('#settlement .second span').text('¥ ' + amount);
            $('.fourth .right').addClass('taped').siblings('.left').removeClass('taped');
            pId = '0000000002';
            context.helpinfo('PersonalPayments.PayWayCommon', function(data){
                $('.notice').html(data);
            });
            settlementView.render(JSON.parse(sessionStorage.shopTrl));
        }
    };
});
