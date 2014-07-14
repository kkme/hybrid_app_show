define(function(require) {
    var apiUrl = require('../apiConfig');
       
    var FindWeidianView = Backbone.View.extend({
        el: '#findWeidian',

        // 底部动画效果
        i: 1,
        initAnimation: function() {
            var self = this;
            window.sId = setTimeout(function() {
                self.i = (self.i > 2) ? 0 : self.i;
                $('.eff_area li').eq(self.i-1).fadeOut(0, function() {
                    $('.eff_area li').eq(self.i).fadeIn(300);
                    self.i += 1;
                    self.initAnimation();
                });
            }, 3000);
        },

        events: {
            'input .menu_ele': 'is_show_ddb',
            'tap .sear': 'dataTransfer',
            'tap .ddb li': 'changeValue',
            'touchstart .sear': 'taped',
            'touchend .sear': 'notap',
            'touchstart .global_button': 'taped',
            'touchend .global_button': 'notap'
        },

        // 判断是否显示下拉联想列表
        is_show_ddb: function() {
            if (localStorage.seek_record) {
                var arr = JSON.parse(localStorage.seek_record);
                if ($('.menu_ele').val() == '') {
                    $('.ddb').hide();
                    return;
                }
                $('.ddb').empty();
                var val = $('.menu_ele').val(),
                    sign = 0;
                $.each(arr, function(index, value) {
                    if (value.indexOf(val) == 0) {
                        sign =1;
                        $('.ddb').append('<li>' + value + '</li>');
                    }
                });
                if (sign == 1) {
                    $('.ddb').show();
                } else {
                    $('.ddb').hide();
                }
            }
        },

        dataTransfer: function() {
            var reg = /^[0-9]+$/,
                fd_id = this.$('input.menu_ele').val();
            if (fd_id == '') {
                alert('请输入收款人手机号/福店ID', function() {}, '提示');
            } else if (!reg.test(fd_id)) {
                alert('输入格式有误，请检查', function() {}, '提示');
            } else {
                sessionStorage.flagshipId = '1';
                sessionStorage.k = fd_id;
                app_router.navigate('!enterWeidian/1', {trigger: true});
                // 存储用户搜索福店记录，用于输入框联想
                var ls_sr = localStorage.seek_record;
                if (!ls_sr) {
                    ls_sr = localStorage.seek_record = '[]';
                } else {
                    var j_ls_sr = JSON.parse(ls_sr);
                    for (i=j_ls_sr.length; i; i--) {
                        if (j_ls_sr[i-1] == fd_id) {
                            return;
                        }
                    }
                }

                var temp = JSON.parse(ls_sr);
                temp.push(fd_id);
                localStorage.seek_record = JSON.stringify(temp);
            }
        },

        changeValue: function(e) {
            this.$('.menu_ele').val($(e.target).text());
            this.$('.ddb').hide();
            this.dataTransfer();
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

    var findWeidianView = new FindWeidianView();

    return {
        init: function(step) {
            findWeidianView.initAnimation();
            require.async('../nav', function(nav) {
                nav.init(step);
            });
        }
    };
});