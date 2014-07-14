define(function(require) {
    var curStep, // 从哪个view跳转过来的标志位
        postData = dT.queryTicket, // 传到后台相关数据
        whichPage, // 传回的数据有几页
        refreshFlag;

    var QueryTickets = Backbone.Collection.extend({
        sync: function() {
            var self = this;
            jfpal.safeAjax('', postData, function(data) {
                whichPage = data.resultBean.TOTALPAGE * 1;
                var arr = [],
                    insure_cost = data.resultBean.SERVICE[0].INSURE_COST;
                $.each(data.resultBean.DATA, function(index, value) {
                    var train_type = (value.TRAIN_NO).charAt(0) == 'D' ? '(动车)' : '(高铁)',
                        reserve = self.hasTicket(value.SEAT);
                    if (reserve != '') {
                        return true;
                    } else {
                        var go_order = ' rel="!writeOrder/1"';
                    }
                    var seat = self.hasOwnTicket(value.SEAT);
                    var obj = {
                        dep_station: value.DEP_STATION,
                        arr_station: value.ARR_STATION,
                        train_no: value.TRAIN_NO,
                        full_time: value.FULL_TIME,
                        go_time: value.GO_TIME,
                        to_time: value.TO_TIME,
                        train_type: train_type,
                        reserve: reserve,
                        shang: seat[0],
                        yi: seat[1],
                        er: seat[2],
                        wo: seat[3],
                        go_order: go_order,
                        insure_cost: insure_cost,
                        current_time: $('.nowDate').text(),
                        seat: [seat[0][1], seat[1][1], seat[2][1], seat[3][1]]
                    };
                    arr.push(obj);
                });
                
                self.reset(arr);

                // 如果不是点击更多，则显示页面
                if (postData.page == '') {
                    var flag = 0;
                    if (arr.length != 0) {
                        // 如果不止一页数据，就显示更多按钮
                        if (whichPage != 1) {
                            $('.main_info_parent').removeAttr('style');
                            $('.more').show();
                        } else {
                            $('.main_info_parent').css('padding-bottom', '60px');
                        }
                    } else {
                        flag = 1;
                        $('#loading').fadeOut(200, function() {
                            alert('无相关售票信息', function() {}, '提示', '确定');
                        });
                    }
                    
                    if (flag == 0 && refreshFlag == 0) {
                        if (arr.length != 0) {
                            require.async('../nav', function(nav) {
                                nav.init(curStep);
                            });
                        } else {
                            $('#loading').fadeOut(200, function() {
                                alert('无相关售票信息', function() {}, '提示', '确定');
                            });
                        }
                    } else {
                        self.goBackUrl();
                    }
                }

                $('#loading').fadeOut(200, function() {});
            }, function(error) {
                if (postData.page == '') {
                    self.goBackUrl();
                }
                $('#loading').fadeOut(200, function() {
                    alert('无相关售票信息', function() {}, '提示', '确定');
                });
            });
        },

        // 判断是否有票
        hasTicket: function(data) {
            var length = data.length,
                sign = ' visible';
            for (var i=length; i; i--) {
                if (data[i-1]['RESERVE'] == '1') {
                    sign = '';
                }
            }
            return sign;
        },

        seat: null, // 各种座位余票和票价信息

        // 生成 seat 数组
        getSeatArr: function(index, value) {
            if (value.RESERVE == '1') {
                this.seat[index][0] = '>50张';
                this.seat[index][1] = '￥' + value.PRICE;
            } else {
                this.seat[index][0] = '无';
                this.seat[index][1] = '无';
            }
        },

        // 判断各种座位是否有票
        hasOwnTicket: function(data) {
            var self = this;
            this.seat = [[], [], [], []]; // 重置 seat 数组
            $.each(data, function(index, value) {
                switch (value.NAME) {
                    case '商务座':
                        self.getSeatArr(0, value);
                        break;
                    case '一等软座':
                        self.getSeatArr(1, value);
                        break;
                    case '二等软座':
                        self.getSeatArr(2, value);
                        break;
                    case '软卧[上下随机]':
                        self.getSeatArr(3, value);
                }
            });
            $.each(this.seat, function(index, value) {
                if (!value[0]) {
                    value[0] = '无';
                    value[1] = '无';
                }
            });
            return this.seat;
        },

        //处理 seat 参数
        dealSeat: function(seat) {
            var seat_no = {};
            $.each(seat, function(index, value) {
                if (value.RESERVE == '1') {
                    seat_no[index] = {};
                    seat_no[index]['seat_type'] = value.NAME;
                    seat_no[index]['seat_price'] = value.PRICE;
                }
            });
            return seat_no;
        },
        goBackUrl: function() {
            switch (curStep) {
                case '1':
                    app_router.navigate('!index', {trigger: false});
                //     break;
                // case '2':
                //     app_router.navigate('!pubGoods', {trigger: false});
            }
        }
    });
       
    var QueryTicketView = Backbone.View.extend({
        el: '#queryTicket',

        collection: new QueryTickets(),

        initialize: function() {
            var self = this;
            this.collection.on('reset', function() {
                // 判断是首次进入此页面渲染数据还是点击更多后渲染数据
                if (postData.page == '') {
                    self.render(0);
                } else {
                    self.render(1);
                }
                
            });
        },

        template: function() {
            var temp = _.template($('#ticket_info').html(), {models: this.collection.toJSON()});
            return temp;
        },

        render: function(state) {
            if (state == 0) {
                this.$('.main_info_parent').html(this.template());
            } else {
                this.$('.main_info_parent').append(this.template());
                this.i += 1;
                if (this.i == (whichPage)) {
                    this.$('.more').hide();
                    this.$('.main_info_parent').css('padding-bottom', '60px');
                }
            }
        },

        events: {
            'tap .prev': 'backOneDay',
            'tap .next': 'goOneDay',
            'tap .main_info': 'toWriteOrderView',
            'tap .more': 'fetch_trainNo_info',
            'tap .container span': 'switchOption',
            'touchstart .more': 'taped',
            'touchend .more': 'notap'
        },

        changeDate: function(date) {
            var sYear = date.getFullYear(),
                sMonth = (date.getMonth() + 1),
                sDate = date.getDate();
                                               
            sMonth = (sMonth < 10) ? ('0' + sMonth) : sMonth;
            sDate = (sDate < 10) ? ('0' + sDate) : sDate;
                                               
            var showDate = sYear + '-' + sMonth + '-' + sDate;
            $('.nowDate').text(showDate);
            return showDate;
        },

        now: new Date(),

        deadline: (new Date()).setDate((new Date()).getDate() + 19),

        isOutOfDate: function(compareDate, sign) {
            if (sign == 1 && compareDate > this.deadline) {
                alert('无法查询19天后的火车票', function() {}, '提示', '确定');
                return false;
            } else if (sign == 0 && compareDate < this.now) {
                alert('无法查询早于今日的火车票', function() {}, '提示', '确定');
                return false;
            } else {
                return true;
            }
        },

        commonDeal: function(sDate) {
            var outDate = this.changeDate(sDate);
            // 点击前一天后一天时，初始化相关操作
            this.$('.more').hide();
            this.$('.main_info_parent > div').remove();
            postData.page = '';
            this.i = 1;
            postData.outDate = outDate;
            $('#loading').fadeIn(200);
            refreshFlag = 1;
            this.collection.fetch();
        },

        backOneDay: function() {
            var sDate = new Date(this.$('.nowDate').text());
            if (this.isOutOfDate(sDate, 0)) {
                sDate.setDate(sDate.getDate() - 1);
                this.commonDeal(sDate);
            }
        },

        goOneDay: function() {
            var sDate = new Date($('.nowDate').text());
            if (this.isOutOfDate(sDate, 1)) {
                sDate.setDate(sDate.getDate() + 1);
                this.commonDeal(sDate);
            }
        },

        // 生成传到下一页的数据，并跳转
        toWriteOrderView: function(e) {
            var obj = $(e.currentTarget);
            if (!!obj.attr('rel')) {
                var train_no = obj.find('.train-no').text();
                $.each(this.collection.models, function(index, value) {
                    var data = value.attributes;
                    if (data.train_no == train_no) {
                        dT.tic_res = {
                            train_no: data.train_no,
                            train_type: data.train_type,
                            dep_station: data.dep_station,
                            arr_station: data.arr_station,
                            go_time: data.go_time,
                            to_time: data.to_time,
                            current_time: $('.nowDate').text(),
                            insure_cost: data.insure_cost,
                            seat: data.seat
                        }
                    }
                });
                app_router.navigate('!writeOrder/1', {trigger: true});
            }
        },

        i: 1, //获取第几页数据

        fetch_trainNo_info: function() {
            $('#loading').fadeIn(200);
            postData.page = this.i + 1 + '';
            this.collection.fetch();
        },

        // 切换余票和票价选项卡
        switchOption: function(e) {
            var obj = $(e.target);
            obj.addClass('taped').siblings().removeClass('taped');
            if (obj.hasClass('t_price')) {
                this.$('.lef_tic').hide();
                this.$('.situ').show();
            } else {
                this.$('.lef_tic').show();
                this.$('.situ').hide();
            }
        },

        taped: function(e) {
            var obj = $(e.target);
            obj.addClass('taped');
        },

        notap: function(e) {
            var obj = $(e.target);
            obj.removeClass('taped');
        },
    });

    var queryTicketView = new QueryTicketView();
       
    return {
        init: function(step) {
            curStep = step;
            if (step == '1') {
                $('#loading').fadeIn(200);
                // 初始化相关状态
                refreshFlag = 0;
                dT.queryTicket.page = '';
                $('.nowDate').text(dT.queryTicket.outDate);
                $('.more').hide();
                $('.r_ticket').addClass('taped').siblings().removeClass('taped');

                queryTicketView.collection.fetch();
            } else {
                require.async('../nav', function(nav) {
                    nav.init(step);
                });
            }
        }
    };
});