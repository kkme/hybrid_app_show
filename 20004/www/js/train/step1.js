define(function(require) {
    var pFlag = this.pFlag; // 平台标志位

    var Step1 = Backbone.View.extend({
        el: '#step1',

        initialize: function() {
            var input_obj = this.$('.dep_date'),
                div_obj = this.$('.dep_date_hack');
            if (pFlag == 'ios') {
                div_obj.hide();
                input_obj.show();
            } else {
                div_obj.show();
                input_obj.hide();
            }
        },

        // 初始化出发日期为明天
        initDepDate: function() {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var sYear = tomorrow.getFullYear(),
                sMonth = (tomorrow.getMonth() + 1),
                sDate = tomorrow.getDate();
            sMonth = (sMonth < 10) ? ('0' + sMonth) : sMonth;
            sDate = (sDate < 10) ? ('0' + sDate) : sDate;                       
            var currentDate = sYear + '-' + sMonth + '-' + sDate;
            
            if (pFlag == 'ios') {
                this.$('.dep_date').val(currentDate);
            } else {
                this.$('.dep_date_hack').text(currentDate);
            }
        },

        // 根据返回的数据的长度添加相应样式
        initfW: function(state, text) {
            var obj = (state == 2) ? this.$('.depp') : this.$('.desp');
            if (text.length != 4 && text.length != 5) {
                obj.removeClass('fw fiw');
            } else if (text.length == 4) {
                obj.removeClass('fiw').addClass('fw');
            } else {
                obj.removeClass('fw').addClass('fiw');
            }
        },

        events: {
            'tap .exchange': 'exchange',
            'tap .depp': 'toCityView',
            'tap .desp': 'toCityView',
            'tap .dep_date': 'callDatePicker',
            'tap .dep_date_hack': 'callDatePicker',
            'tap .global_button': 'toQueryTicketView',
            'touchstart .global_button': 'taped',
            'touchend .global_button': 'notap',
        },
            
        // 交换出发地和目的地                         
        exchange: function() {
            var temp = this.$('.depp'),
                atemp = this.$('.desp'),
                tLength = temp.text().length,
                aLength = atemp.text().length;

            // 为了适应字体大小变化，擦，蛋疼，加了这么多行代码
            if (tLength != aLength) {
                if (tLength == 4 && (aLength == 2 || aLength == 3)) {
                    temp.removeClass('fw');
                    atemp.addClass('fw');
                } else if (aLength == 4 && (tLength == 2 || tLength == 3)) {
                    atemp.removeClass('fw');
                    temp.addClass('fw');
                } else if (tLength == 5 && (aLength == 2 || aLength == 3)) {
                    temp.removeClass('fiw');
                    atemp.addClass('fiw');
                } else if (aLength == 5 && (tLength == 2 || tLength == 3)) {
                    atemp.removeClass('fiw');
                    temp.addClass('fiw');
                } else if (tLength == 4 && aLength == 5) {
                    temp.removeClass('fw').addClass('fiw');
                    atemp.removeClass('fiw').addClass('fw');
                } else if (tLength == 5 && aLength == 4) {
                    temp.removeClass('fiw').addClass('fw');
                    atemp.removeClass('fw').addClass('fiw');
                }
            }

            var iv = temp.text();
            temp.text(atemp.text());
            atemp.text(iv);
        },
    
        // 跳转到城市列表页                   
        toCityView: function(e) {
            var obj = $(e.target);
            app_router.navigate(obj.attr('rel'), {trigger: true});
        },

        // 格式化通过 DatePicker 返回的时间数据
        formateDatePicker: function(date) {
            var sYear = date.getFullYear(),
                sMonth = (date.getMonth() + 1),
                sDate = date.getDate();
                                               
            sMonth = (sMonth < 10) ? ('0' + sMonth) : sMonth;
            sDate = (sDate < 10) ? ('0' + sDate) : sDate;
                                               
            var showDate = sYear + '-' + sMonth + '-' + sDate;
            return showDate;
        },

        // 如果是安卓系统，则调用cordova第三方插件来显示原生的日期框
        callDatePicker: function(e) {
            if (pFlag == 'android') {
                var self = this;
                var options = {
                    date: new Date(),
                    mode: 'date'
                };
                datePicker.show(options, function(date) {
                    if (date != 'Invalid Date') {
                        var date = new Date(date);
                        self.$('.dep_date_hack').text(self.formateDatePicker(date));
                    }
                });
            }
        },

        // 获取出发时间段
        getTimeQuantum: function() {
            var quan = this.$('.chsQ option:selected').text(),
                timeQuantum;
            switch (quan) {
                case '00:00-24:00(整天)':
                    timeQuantum = '00:00-24:00';
                    break;
                case '00:00-06:00(早晨)':
                    timeQuantum = '00:00-06:00';
                    break;
                case '06:00-12:00(上午)':
                    timeQuantum = '06:00-12:00';
                    break;
                case '12:00-18:00(下午)':
                    timeQuantum = '12:00-18:00';
                    break;
                case '18:00-24:00(晚上)':
                    timeQuantum = '18:00-24:00';
            }
            return timeQuantum;
        },

        // 获取车次类型
        getTrainType: function() {
            var tT = this.$('.tT option:selected').text(),
                trainType;
            switch(tT) {
                case '全部':
                    trainType = 'G|D';
                    break;
                case 'G(高铁)':
                    trainType = 'G';
                    break;
                case 'D(动车)':
                    trainType = 'D';
            }
            return trainType;
        },

        // 跳转到搜索车票页
        toQueryTicketView: function() {
            // 保存搜索记录到本地
            var arr = [this.$('.depp').text(), this.$('.desp').text()];
            if (localStorage.history) {   
                var hArr = JSON.parse(localStorage.history),
                    flag = 0;
                $.each(hArr, function(index, value) {
                    if (arr[0] == value[0] && arr[1] == value[1]) {
                        flag = 1;
                        return false;
                    }
                });
                if (flag == 0) {
                    hArr.push(arr);
                    localStorage.history = JSON.stringify(hArr);
                }
            } else {
                var tempArr = [arr];
                localStorage.history = JSON.stringify(tempArr);
            }

            var obj = dT.queryTicket;
            obj.outCity = this.$('.depp').text();
            obj.arrCity = this.$('.desp').text();
            obj.outDate = (pFlag == 'ios') ? this.$('.dep_date').val() : this.$('.dep_date_hack').text();
            obj.timeQuantum = this.getTimeQuantum();
            obj.trainType = this.getTrainType();
            app_router.navigate('!queryTicket/1', {trigger: true});
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

    var step1 = new Step1();

    return {
        init: function(step) {
            switch (step) {
                case '':
                    step1.initDepDate();
                    break;
                case '2':
                    var text = dT.station.dep_station;
                    $('#step1 .depp').text(text);
                    step1.initfW(2, text);
                    break;
                case '3':
                    var text = dT.station.des_station;
                    $('#step1 .desp').text(text);
                    step1.initfW(3, text);
                    break;
                case '8':
                    var text = dT.station.dep_station;
                    $('#step1 .depp').text(text);
                    step1.initfW(2, text);

                    var text = dT.station.des_station;
                    $('#step1 .desp').text(text);
                    step1.initfW(3, text);
            }
            require.async('../nav', function(nav) {
                nav.init(step);
            });
        }
    };
});