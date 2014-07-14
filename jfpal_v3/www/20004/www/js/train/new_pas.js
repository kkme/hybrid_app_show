define(function(require) {
    var postData = {
        mobileNo: context.user.mobileNo,
        cardType: '二代身份证',
        linkManType: '成人',
        sequenceNum: '888'
    };

    var NewPassengers = Backbone.Collection.extend({
        sync: function() {
            var self = this;
            if (postData.application == 'SaveLinkManInfo') {
                // 验证服务器是否已经存有此联系人
                jfpal.safeAjax('', {application: 'GetHistoryLinkManInfo', mobileNo: context.user.mobileNo}, function(data) {
                    var flag = 0;
                    $.each(data.resultBean, function(index, value) {
                        if (postData.cardNum == value.PID) {
                            flag = 1;
                            $('#loading').fadeOut(200, function() {
                                alert('联系人已存在', function() {}, '提示', '确定');
                            });
                            return false;
                        }
                    });
                    if (flag == 0) {
                        self.uploadInfo();
                    }
                }, function(error) {
                    $('#loading').fadeOut(200, function() {
                        alert('请检查网络', function() {}, '提示', '确定');
                    });
                });
            } else {
                self.uploadInfo();
            }
        },
        uploadInfo: function() {
            jfpal.safeAjax('', postData, function(data) {
                alert('保存成功', function() {
                    app_router.navigate('!addPassenger/3', {trigger: true});
                }, '提示', '确定');
            }, function(error) {
                alert(error.respDesc, function() {}, '提示', '确定');
            });
        }
    });
       
    var NewPassengerView = Backbone.View.extend({
        el: '#new_pas',

        collection: new NewPassengers(),
                                           
        initialize: function() {

        },

        events: {
            'tap label': 'toggleSelected',
            'tap .save': 'save_pas',
            'touchstart .save': 'taped',
            'touchend .save': 'notap'
        },

        toggleSelected: function(e) {
            var obj = $(e.target);
            obj.addClass('taped').siblings().removeClass('taped');
        },

        vertify: function() {
            //校验名字是否为中文名
            var p_name = this.$('.p_name').val();
            var reg1 = /^[\u4E00-\u9FA5]+$/;

            //校验身份证号码是否合法
            var ide_number = this.$('.ide_number').val();
            var reg2 = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

            //校验手机号码是否为11位
            var phone_no = this.$('.phone_no').val();
            var reg3 = /(^(\d{11})$)/;

            if (p_name == '') {
                alert('乘客姓名不能为空', function() {}, '提示', '确定');
                return 0;
            }
            if (!reg1.test(p_name)) {
                alert('乘客姓名格式有误，请检查', function() {}, '提示', '确定');
                return 0;
            }
            if (p_name.length == 1) {
                alert('乘客姓名不能少于两位', function() {}, '提示', '确定');
                return 0;
            }
            if (p_name.length > 6) {
                alert('乘客姓名不能大于六位', function() {}, '提示', '确定');
                return 0;
            }
            if (ide_number == '') {
                alert('证件号码不能为空', function() {}, '提示', '确定');
                return 0;
            }
            if (!reg2.test(ide_number)) {
                alert('证件号码格式有误，请检查', function() {}, '提示', '确定');
                return 0;
            }
            if (phone_no == '') {
                alert('联系电话不能为空', function() {}, '提示', '确定');
                return 0;
            }
            if (!reg3.test(phone_no)) {
                alert('联系电话格式有误，请检查', function() {}, '提示', '确定');
                return 0;
            }

            postData.linkManName = p_name;
            postData.linkManSex = this.$('.sex').find('.taped').text();
            postData.cardNum = ide_number;
            postData.linkManPhone = phone_no;
            return 1;
        },

        save_pas: function() {
            if (this.vertify() == 1) {
                $('#loading').fadeIn(200);
                this.collection.fetch();
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

    var newPassengerView = new NewPassengerView();
       
    return {
        init: function(step) {
            var pas_info = dT.pas_info;
            if (step == '1') {
                //初始化相关操作
                $('.p_name, .ide_number, .phone_no').val('');
                $('.male').addClass('taped').siblings().removeClass('taped');
                postData.application = 'SaveLinkManInfo';
                delete(postData.linkManNum);
            } else {
                var obj = dT.pas_info;
                $('.p_name').val(obj.c_name);
                $('.ide_number').val(obj.pid);
                $('.phone_no').val(obj.mobile_no);
                if (obj.sex == '男') {
                    $('.male').addClass('taped').siblings().removeClass('taped');
                } else {
                    $('.female').addClass('taped').siblings().removeClass('taped');
                }
                postData.application = 'UpdateLinkManInfo';
                postData.linkManNum = obj.c_id;
            }
            require.async('../nav', function(nav) {
                nav.init(step);
            });
        }
    };
});