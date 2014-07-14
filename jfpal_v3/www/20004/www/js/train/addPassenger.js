define(function(require) {
    var pFlag = this.pFlag, // 平台标志位
        curStep, // 从哪个view跳转过来的标志位
        arr, // 所有乘客信息
        linkManNum, // 要删除乘客的cid号
        element; // 要移除的元素

    var AddPassengers = Backbone.Collection.extend({
        sync: function() {
            var self = this;                                
            jfpal.safeAjax('', {application: 'GetHistoryLinkManInfo', mobileNo: context.user.mobileNo}, function(data) {
                if (data.resultBean.length != 0) {
                    $.each(data.resultBean, function(index, value) {
                        var obj = {
                            c_name: value.CNAME,
                            mobile_no: value.MOBILENO,
                            pid_type: value.PIDTYPE,
                            pid: value.PID,
                            c_id: value.CID,
                            sex: value.SEX
                        };
                        arr.push(obj);
                    });
                    self.reset(arr);
                    require.async('../nav', function(nav) {
                        nav.init(curStep);
                    });
                    $('#loading').fadeOut(200);
                } else {
                    $('#loading').fadeOut(200, function() {
                        confirm('还未增加乘客信息，是否添加？', function(index) {
                            if (index == 1) {
                                app_router.navigate('!new_pas/1', {trigger: true});
                            } else {
                                self.goBackUrl();
                            }
                        }, '提示');
                    });
                }
            }, function(error) {
                self.goBackUrl();
                $('#loading').fadeOut(200, function() {
                    alert(error.respDesc, function() {}, '提示', '确定');
                });
            });
        },
        goBackUrl: function() {
            switch (curStep) {
                case '1':
                    app_router.navigate('!writeOrder', {trigger: false});
                    break;
                case '3':
                    app_router.navigate('!new_pas', {trigger: false});
            }
        }
    });

    var DeleteLinkManInfoModel = Backbone.Model.extend({
        sync: function() {
            jfpal.safeAjax('', {application: 'DeleteLinkManInfo', mobileNo: context.user.mobileNo, linkManNum: linkManNum}, function(data) {
                    element.fadeOut(500, function() {
                        element.remove();
                    });
                }, function(error) {
                    alert('删除失败', function() {}, '提示', '确定');
                });
        }
    });
       
    var AddPassengerView = Backbone.View.extend({
        el: '#addPassenger',

        model: new DeleteLinkManInfoModel(),

        collection: new AddPassengers(),
                                           
        initialize: function() {
            var self = this;
            this.collection.bind('reset', function() {
                self.render();
            });
        },

        template: function() {
            var temp = _.template($('#pas_info').html(), {models: this.collection.toJSON()});
            return temp;
        },

        render: function() {
            this.$('menu').html(this.template());
        },

        events: {
            'tap li': 'toggleSelected',
            'swipeLeft menu > div': 'modify_delete',
            'longTap menu > div': 'modify_delete_hack',
            'swipeRight menu > div': 'cancel',
            'tap .modify': 'modify_info', // 编辑联系人
            'tap .delete': 'delete_remote', // 删除联系人
            'tap .global_button': 'return_pas_info',
            'touchstart .modify': 'taped',
            'touchend .modify': 'notap',
            'touchstart .delete': 'taped',
            'touchend .delete': 'notap',
            'touchstart .global_button': 'taped',
            'touchend .global_button': 'notap'
        },

        toggleSelected: function(e) {
            var obj = $(e.currentTarget);
            obj.find('.tick').toggleClass('selected');
        },

        modify_delete: function(e) {
            var obj = $(e.currentTarget);
            obj.find('.modify, .delete').addClass('moveLeft');
        },

        modify_delete_hack: function(e) {
            var self = this;
            confirm('', function(index) {
                if (index == 1) {
                    self.modify_info(e);
                } else if (index == 2) {
                    self.confirm_delete(e, 2);
                }
            }, '请选择', ['编辑联系人', '删除联系人']);
        },

        cancel: function(e) {
            var obj = $(e.currentTarget);
            obj.find('.modify, .delete').removeClass('moveLeft');
        },

        modify_info: function(e) {
            var obj = $(e.target),
                parent = obj.parents('.info_area'),
                index = parent.index(),
                temp = arr[index];
            dT.pas_info = {
                c_name: temp.c_name,
                mobile_no: temp.mobile_no,
                pid_type: temp.pid_type,
                pid: temp.pid,
                c_id: temp.c_id,
                sex: temp.sex
            };
            app_router.navigate('!new_pas/2', {trigger: true});
        },

        confirm_delete: function(e, status) {
            if (status == 2) {
                var obj = $(e.target),
                    parent = obj.parents('.info_area'),
                    index = parent.index();
                linkManNum = arr[index]['c_id'];
                element = parent;
                this.model.sync(); // 删除联系人信息
            }
        },

        delete_remote: function(e) {
            var self = this;
            confirm('确认删除该乘客信息？', function(index) {
                self.confirm_delete(e, index);
            }, '提示', ['取消', '确定']);
        },

        // 处理返回的乘客信息
        dealPassengerInfo: function(data) {
            var tempObj = dT.passe_info;
            data.forEach(function(value, index) {
                if (!tempObj[value.pid]) {
                    tempObj[value.pid] = value;
                }
            });
            dT.passe_info = tempObj;
        },

        return_pas_info: function() {
            var return_pass_info = [];
            this.$('li').each(function(index) {
                if ($(this).children('.tick').hasClass('selected')) {
                    return_pass_info.push(arr[index]);
                }
            });
            this.dealPassengerInfo(return_pass_info);
            app_router.navigate('!writeOrder/3', {trigger: true});
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

    var addPassengerView = new AddPassengerView();
       
    return {
        init: function(step) {
            curStep = step;
            if (step == '1' || step == '3') {
                $('#loading').fadeIn(200);
                arr = []; // 初始化相关数据
                addPassengerView.collection.fetch();
            } else {
                // 初始化相关数据
                $('.tick').removeClass('selected');
                $('.modify, .delete').removeClass('moveLeft');

                require.async('../nav', function(nav) {
                    nav.init(step);
                });
            }
        }
    };
});