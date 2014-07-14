define(function(require) {
    $('html, body').height('auto');
    
    var apiUrl = require('../apiConfig');

    var curStep;
    var skInfo;

    var SkInfo = Backbone.Model.extend({
        url: apiUrl.addr + '?r=store.tinyshop.login',
        sync: function() {
            var self = this;
            $.ajax({
                url: this.url,
                type: 'post',
                data: {
                    mobile_no: context.user.mobileNo,
                    username: context.user.realName,
                    token: context.user.token
                },
                success: function(data) {
                    if (data.success) {
                        sessionStorage.tinyshop_id = data.tinyshop.id;
                        skInfo = data.tinyshop;
                        myWeidianView.render(0, data.tinyshop);
                        myWeidianView.collection.fetch(); //回调成功后，获取商品列表
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
        }
    });

    var GoodList = Backbone.Collection.extend({
        url: apiUrl.addr + '?r=store.product.list',
        sync: function() {
            var self = this;
            $.ajax({
                url: this.url,
                type: 'get',
                data: {
                    mobile_no: context.user.mobileNo
                },
                success: function(data) {
                    if (data.success) {
                        self.reset(data.product_list);
                        //显示页面
                        require.async('../nav', function(nav) {
                            nav.init(curStep);
                        });
                        $('#loading').fadeOut(200);
                        $('.goods_no').text(data.product_list.length);
                    } else {
                        self.goBackUrl();
                        $('#loading').fadeOut(200, function() {
                            alert(data.msg, function() {}, '提示', '确定');
                        });
                    }
                },
                error: function() {
                    self.goBackUrl();
                    $('#loading').fadeOut(200, function() {
                        alert('请检查当前网络', function() {}, '提示', '确定');
                    });
                }
            });
        },
        goBackUrl: function() {
            switch (curStep) {
                case '4':
                    app_router.navigate('!shopEidt', {trigger: false});
                    break;
                case '2':
                    app_router.navigate('!pubGoods', {trigger: false});
            }
        }
    });
       
    var MyWeidianView = Backbone.View.extend({
        el: '#myWeidian',

        model: new SkInfo(),

        collection: new GoodList(),

        initialize: function() {
            var self = this;
            //监听 collection reset 事件
            this.collection.on('reset', function() {
                self.render(1);
            });

            var width = ($(window).width() * 0.9 - 240)/3;
            $('#shareLayer li').css('margin-left', width);

            $('#shareLayer .cancel').on('touchstart', function() {
                $(this).addClass('taped');
            });

            $('#shareLayer .cancel').on('touchend', function() {
                $(this).removeClass('taped');
            });

            $('#shareLayer .cancel').on('click', function() {
                $('#shareLayer').fadeOut(400);
                $('#myWeidian').removeClass('blur_effect');
                $('nav').removeClass('blur_effect');
            });

            $('#shareLayer').on('touchstart', 'li', function(e) {
                var obj = $(e.target);
                obj.addClass('taped');
            });

            $('#shareLayer').on('touchend', 'li', function(e) {
                var obj = $(e.target);
                obj.removeClass('taped');
            });
        },

        m_template: function(data) {
            var temp = _.template($('#sk_info').html(), {model: data});
            return temp;
        },

        c_template: function(collection) {
            var temp = _.template($('#goods_list').html(), {collection: collection});
            return temp;
        },

        render: function(state, data) {
            if (state == 0) {
                this.$('.tpl_part').html(this.m_template(data));
            } else if (state == 1) {
                this.$('.goods_list').html(this.c_template(this.collection.toJSON()));
            } else {
                this.$('.goods_list').html(this.c_template(data));
                this.$('.goods_no').text(data.length);
            }
        },

        events: {
            'click .sk_info': 'showShopEdit',
            'click .last': 'shareShop',
            'click .bottom_bar div': 'toggleEffect',
            'touchstart .last': 'tapBg',
            'touchend .last': 'notapBg'
        },

        showShopEdit: function(e) {
            sessionStorage.skInfo = JSON.stringify(skInfo);
            var obj = $(e.currentTarget);
            app_router.navigate(obj.attr('rel'), {trigger: true});
        },

        shareShop: function() {
            this.$el.addClass('blur_effect');
            $('nav').addClass('blur_effect');
            $('#shareLayer').fadeIn(400);
        },

        tapBg: function() {
            $('.share').addClass('taped');
        },

        notapBg: function() {
            $('.share').removeClass('taped');
        },

        toggleEffect: function(e) {
            var obj = $(e.currentTarget);
            obj.addClass('taped').siblings().removeClass('taped');
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

    var myWeidianView = new MyWeidianView();

    return {
        init: function(step) {
            if (step == '4' || step == '1') {
                curStep = step;
                $('#loading').fadeIn(200);
                myWeidianView.model.save();
            } else {
                if (step == '2') {
                    myWeidianView.render(2, JSON.parse(sessionStorage.pl));
                }
                require.async('../nav', function(nav) {
                    nav.init(step);
                });
            }
        }
    };
});