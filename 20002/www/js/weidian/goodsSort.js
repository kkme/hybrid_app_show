define(function(require) {
    $('html, body').height('auto');
    
    var apiUrl = require('../apiConfig');

    var curStep;

    var GoodSort = Backbone.Collection.extend({
        url: apiUrl.addr + '?r=store.goods.category',
        sync: function() {
            var self = this;
            $.ajax({
                url: this.url,
                type: 'get',
                success: function(data) {
                    if (data.success) {
                        self.reset(data.goodscategory);
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
                    app_router.navigate('!pub_goods_details', {trigger: false});
            }
        }
    });
       
    var GoodsSortView = Backbone.View.extend({
        el: '#goods_sort',

        collection: new GoodSort(),

        initialize: function() {
            var self = this;
            this.collection.on('reset', function() {
                self.render();
            });
        },

        template: function(collection) {
            var temp = _.template($('#goods_sort_tpl').html(), {collection: collection});
            return temp;
        },

        render: function() {
            this.$('ul').html(this.template(this.collection.toJSON()));
        },

        events: {
            'click li': 'showGoodsLibrary'
        },

        showGoodsLibrary: function(e) {
            var obj = $(e.currentTarget);
            sessionStorage.cate_id = obj.attr('data-id');
            app_router.navigate('!goods_library/1', {trigger: true});
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

    var goodsSortView = new GoodsSortView();

    return {
        init: function(step) {
            if (step == '1') {
                curStep = step;
                $('#loading').fadeIn(200);
                goodsSortView.collection.fetch();
            } else {
                require.async('../nav', function(nav) {
                    nav.init(curStep);
                });
            }
        }
    };
});