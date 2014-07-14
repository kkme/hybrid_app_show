define(function(require) {
    var curStep, // 从哪个view跳转过来的标志位
        postData = {
            application: 'SaveTrainOrderInfo',
            mobileNo: context.user.mobileNo
        }; // 提交数据

    var WriteOrders = Backbone.Collection.extend({
        sync: function() {
            jfpal.safeAjax('', postData, function(data) {
                $('#loading').fadeOut(200, function() {
                    jfpal.jfPay({
                        'merchantId': '0004000004',
                        'merchantName': '火车票订单',
                        'productId': '0000000000',
                        'orderAmt': (data.resultBean.AMOUNT * 100).toFixed(0) + '',
                        'orderDesc': data.resultBean.ORDERID,
                        'orderRemark': ''
                    }, function(data) {
                        console.log(data);
                    }, function(error) {
                        console.log(error);
                    });
                });
            }, function(error) {
                $('#loading').fadeOut(200, function() {
                    alert(error.respDesc, function() {}, '提示', '确定');
                });
            });
        }
    });
       
    var WriteOrderView = Backbone.View.extend({
        el: '#writeOrder',

        collection: new WriteOrders(),

        initialize: function() {
            this.collection.on('reset', this.render, this);             
        },

        template: function() {
            var temp = _.template($('#write_order_info').html(), {models: dT.tic_res});
            return temp;
        },

        t_template: function() {
            var temp = _.template($('#seat_info').html(), {seat_info: dT.tic_res.seat});
            return temp;
        },

        template2: function() {
            var temp = _.template($('#add_pas_info_tlp').html(), {models: dT.passe_info});
            return temp;
        },

        render: function(state) {
            if (state == 0) {
                this.$('.confirm_order .first').html(this.template());
                this.$('.confirm_order > menu').html(this.t_template());
            } else {
                this.$('.passenger_info > menu').html(this.template2());
            }
        },

        events: {
            'tap .confirm_order > menu li': 'toggleSelect',
            'tap .d_pas': 'delete_pas',
            'tap .add_passenger': 'addPassenger',
            'tap .c_pic': 'getContactsInfo',
            'tap .submit': 'submitOrder',
            'touchstart .submit': 'taped',
            'touchend .submit': 'notap'
        },

        toggleSelect: function(e) {
            var obj = $(e.currentTarget);
            obj.find('.last').addClass('taped').parent().siblings().find('.last').removeClass('taped');

            var price = obj.find('.third').text().slice(1) * 1;
            this.$('.jiage').text(price);
            var peopleNo = this.$('.passenger_info li').length;
            this.$('.renshu').text(peopleNo);
            this.$('.allMoney').text(peopleNo * (price + 10));
        },

        getContactsInfo: function() {
            var self = this;
            window.plugins.ContactChooser.chooseContact(function(contactInfo) {
                self.$('.c-name').val(contactInfo.displayName);
                self.$('.c-no').val(contactInfo.phoneNumber);
            });
        },

        delete_pas: function(e) {
            var self = this;
            confirm('确认删除该乘客信息？', function(index) {
                if (index == 1) {
                    var obj = $(e.target);
                    obj.parent().fadeOut(300, function() {
                        delete dT.passe_info[obj.siblings('.pid').text()];
                        $(this).remove();
                        var peopleNo = self.$('.passenger_info li').length;
                        var price = self.$('.jiage').text() * 1;
                        self.$('.renshu').text(peopleNo);
                        self.$('.allMoney').text(peopleNo * (price + peopleNo));
                    });
                }
            }, '提示', ['确定', '取消']);
        },

        addPassenger: function(e) {
            var obj = $(e.currentTarget);
            app_router.navigate(obj.attr('rel'), {trigger: true});
        },

        // 处理提交所需数据
        submitOrder: function() {
            var pNo = this.$('.passenger_info li').length;
            if (pNo > 5) {
                alert('乘客人数不能多余5位', function() {}, '提示', '确定');
                return;
            } else if (pNo < 1) {
                alert('必须有至少一位乘客', function() {}, '提示', '确定');
                return;
            } else if (this.$('c-name').val() == '' || this.$('.c-no').val() == '') {
                alert('请检查联系人信息', function() {}, '提示', '确定');
                return;
            }
            $('#loading').fadeIn(200);
            var seat_info = dT.tic_res,
                insure_cost = seat_info.insure_cost;
            postData.trainInfo = seat_info.train_no + '|' + seat_info.current_time + '|' + seat_info.dep_station + '|' + seat_info.arr_station + '|' + seat_info.go_time + '|' + seat_info.to_time;
            var obj = this.$('.confirm_order > menu span').filter('.taped'),
                seat_name = obj.siblings('.first').text(),
                price = obj.siblings('.third').text().slice(1),
                pasArr = dT.passe_info,
                length = pasArr.length;
            postData.passenageInfo = '';
            $.each(pasArr, function(key, value) {
                postData.passenageInfo += '成人票|' + value.c_name + '|' + '二代身份证|' + value.pid + '|' + value.mobile_no + '|' + seat_name + '|' + price + '|' + '5|' + '5|' + insure_cost + '^';
            });
            postData.passenageInfo = postData.passenageInfo.slice(0, -1);
            
            postData.contactInfo = this.$('.c-name').val() + '|' + this.$('.c-no').val();
            postData.expInfo = '0|||||';

            this.collection.fetch();
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

    var writeOrderView = new WriteOrderView();
       
    return {
        init: function(step) {
            curStep = step;
            if (step == '1') {
                // 初始化相关操作
                $('.passenger_info menu li').remove();
                $('.getContacts input').val('');
                $('.renshu, .allMoney').text('0');
                writeOrderView.render(0);
                var obj = dT.tic_res.seat,
                    length = obj.length,
                    i;
                for (i=0; i<length; i++) {
                    if (obj[i] != '无') {
                        $('.jiage').text(obj[i].slice(1));
                        break;
                    }
                }
            } else if (step == '3') {
                writeOrderView.render();
                var pas_no = dT.passe_info.length + '';
                $('.renshu').text(pas_no);
                var price = $('.jiage').text() * 1;
                $('.allMoney').text(pas_no * (10 + price));
            }
            require.async('../nav', function(nav) {
                nav.init(step);
            });
        }
    };
});
