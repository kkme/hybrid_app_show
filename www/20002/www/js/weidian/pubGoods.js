define(function(require) {
    $('html, body').height('auto');
    
    var apiUrl = require('../apiConfig');

    var curStep;

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
                        sessionStorage.pl = JSON.stringify(data.product_list);
                        self.reset(data.product_list);
                        //显示页面
                        require.async('../nav', function(nav) {
                            nav.init(curStep);
                        });
                        $('#loading').fadeOut(200);
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
                case '1':
                    app_router.navigate('!myWeidian', {trigger: false});
                    break;
                case '3':
                    app_router.navigate('!pub_goods_details', {trigger: false});
            }
        }
    });

    var PubGoodsView = Backbone.View.extend({
        el: '#pubGoods',

        collection: new GoodList(),

        template: function(collection) {
            var temp = _.template($('#goods_list').html(), {collection: collection});
            return temp;
        },

        render: function(state) {
            this.$('.goods_list').html(this.template(this.collection.toJSON()));
        },

        initialize: function() {
            var self = this;
            //监听 collection reset 事件
            this.collection.on('reset', function() {
                self.render();
            });
        },

        events: {
            'touchstart .enter_weidian': 'taped',
            'touchend .enter_weidian': 'notap',
        	'touchstart .pub_goods': 'taped',
        	'touchend .pub_goods': 'notap',
            'click .add_goods': 'jumpNextView',
            'click li': 'toNextView'
        },

        jumpNextView: function(e) {
            var obj = $(e.currentTarget);
            app_router.navigate(obj.attr('rel'), {trigger: true});
        },

        toNextView: function(e) {
            var obj = $(e.currentTarget);
            sessionStorage.category_id = obj.attr('data-id');
            app_router.navigate('!pub_goods_details/3', {trigger: true});
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

    var pubGoodsView = new PubGoodsView();

    return {
        init: function(step) {
            if (step != '2') {
                curStep = step;
                $('#loading').fadeIn(200);
                pubGoodsView.collection.fetch();
            } else {
                require.async('../nav', function(nav) {
                    nav.init(step);
                });
            }
        }
    };
});