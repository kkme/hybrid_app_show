define(function(require) {
    $('html, body').height('auto');
    
    var apiUrl = require('../apiConfig');

    var curStep;

    var gl = [];

    var GoodLibrary = Backbone.Collection.extend({
        url: apiUrl.addr + '?r=store.goods.lib',
        sync: function() {
            var self = this;
            $.ajax({
                url: this.url,
                type: 'get',
                data: {
                    category_id: sessionStorage.cate_id
                },
                success: function(data) {
                    if (data.success) {
                        gl = data.goodslib;
                        self.reset(data.goodslib);
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
                    app_router.navigate('!goods_sort', {trigger: false});
            }
        }
    });

    var GoodsLibraryView = Backbone.View.extend({
        el: '#goods_library',

        collection: new GoodLibrary(),

        initialize: function() {
            var self = this;
            this.collection.on('reset', function() {
                self.render();
            });
        },

        template: function(collection) {
            var temp = _.template($('#goods_list_tpl').html(), {collection: collection});
            return temp;
        },

        render: function() {
            this.$('.goods_list').html(this.template(this.collection.toJSON()));
        },

        events: {
            'click li': 'changeBg',
            'click .global_button': 'editGoods',
            'touchstart .global_button': 'taped',
            'touchend .global_button': 'notap'
        },

        changeBg: function(e) {
            var obj = $(e.currentTarget);
            obj.addClass('taped').siblings().removeClass('taped');
        },

        getGoodsInfo: function() {
            var sit = this.$('li').filter('.taped').index();
            return gl[sit];
        },

        editGoods: function(e) {
            sessionStorage.goodsInfo = JSON.stringify(this.getGoodsInfo());
            var obj = $(e.currentTarget);
            app_router.navigate(obj.attr('rel'), {trigger: true});
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

    var goodsLibraryView = new GoodsLibraryView();

    return {
        init: function(step) {
            curStep = step;
            $('#loading').fadeIn(200);
            goodsLibraryView.collection.fetch();
        }
    };
});