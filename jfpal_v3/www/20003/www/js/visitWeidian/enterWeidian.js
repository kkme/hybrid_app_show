define(function(require) {
    $('html, body').height('auto');

    var apiUrl = require('../apiConfig');

    var curStep;
    var pl = '';
    var ntText;

    var SkInfo = Backbone.Model.extend({
        url: apiUrl.addr + '?r=store.tinyshop.detail',
        sync: function() {
            var self = this;
            $.ajax({
                url: this.url,
                type: 'get',
                data: {
                    mobile_no: sessionStorage.k
                },
                success: function(data) {
                    if (data.success) {
                        ntText = data.tinyshop.name;
                        $('.navTitle').text(ntText); //导航栏标题
                        enterWeidianView.render(0, data.tinyshop);
                        sessionStorage.mobile_no = data.tinyshop.mobile_no;
                        enterWeidianView.collection.fetch();
                        clearTimeout(sId); // 停止首页底部动画
                    } else {
                        self.goBackUrl();
                        $('#loading').fadeOut(200, function() {
                            alert(data.msg, function() {}, '提示', '确定');
                        });
                        $('.bargain_price').focus();
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
                    app_router.navigate('!findWeidian', {trigger: false});
            }
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
                    mobile_no: sessionStorage.mobile_no
                },
                success: function(data) {
                    if (data.success) {
                        pl = data.product_list;
                        self.reset(data.product_list);
                        //显示页面
                        require.async('../nav', function(nav) {
                            nav.init(curStep, ntText);
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
                    app_router.navigate('!findWeidian', {trigger: false});
            }
        }
    });
       
    var EnterWeidianView = Backbone.View.extend({
        el: '#enterWeidian',

        model: new SkInfo(),

        collection: new GoodList(),

        initialize: function() {
            var self = this;
            var sign = 0;
            //监听 model change 事件
            this.model.on('change', function() {
                self.render(0);
            });
            //监听 collection reset 事件
            this.collection.on('reset', function() {
                self.render(1);
            });

            $('#trolley_layer .global_button').on('touchstart', function() {
                $(this).addClass('taped');
            });

            $('#trolley_layer .global_button').on('touchend', function() {
                $(this).removeClass('taped');
            });

            $('#trolley_layer .global_button').on('click', function() {
                // 判断输入框是否为空
                var flag = 0;
                $('#trolley_layer input').each(function(e) {
                    if ($(this).data('data-sign') == '1') {
                        flag = 1;
                        return false;
                    }
                });

                if (flag == 1) {
                    alert('数量不能为空，请检查', function() {}, '提示', '确定');
                } else if (sign == 1) {
                    alert('输入格式有误，请检查', function() {}, '提示', '确定');
                } else if (sign == 2) {
                    alert('总价不能大于1千万元，请修改商品数量', function() {}, '提示', '确定');
                } else {
                    var stLength = 0;
                    $.each(self.shopTrl, function(key, value) {
                        stLength += value.length;
                    });
                    self.$('.trolley_icon span').text(stLength);
                    $('#trolley_layer').fadeOut(400);
                    $('#enterWeidian').removeClass('blur_effect');
                    $('nav .leftButton').removeAttr('style'); // 显示导航栏返回按钮
                }
            });

            $('#trolley_layer').on('focus', '.amount', function() {
                $('#trolley_layer .last_li').hide();
            });

            $('#trolley_layer').on('blur', '.amount', function() {
                $('#trolley_layer .last_li').show();
            });

            $('#trolley_layer').on('touchstart', '.del', function() {
                $(this).addClass('taped');
            });

            $('#trolley_layer').on('touchend', '.del', function() {
                $(this).removeClass('taped');
            });

            $('#trolley_layer').on('click', '.del', function(e) {
                var curLi = $(e.target).parent('li');
                var obj = self.shopTrl[curLi.attr('data-id')];
                var op = self.$('.order_price');
                var bp = self.$('.bargain_price');

                self.barPrice -= obj[0]['price'] * obj.length;   
                //如果用户没有改动成交价，则改动成交价
                if (op.text() == bp.val()) {
                    bp.val(self.barPrice);
                }

                op.text(self.barPrice);

                delete self.shopTrl[curLi.attr('data-id')];
                curLi.fadeOut(200, function() {
                    this.remove();
                });
            });

            $('#trolley_layer').on('input', '.no', function(e) {
                // 输入框限制在4位数，并且不能输入小数点
                var temp = $(e.target);
                if (temp.val().indexOf('.') != -1 || temp.val().length > 4) {
                    temp.val(temp.val().slice(0, -1));
                }
                // 输入0个产品数，会强制改为1.
                var val = (temp.val() == '0') ? '1' : temp.val();
                temp.val(val);

                var reg = /^[0-9]+$/;
                if (reg.test(val)) {
                    temp.removeData('data-sign');

                    var curLi = $(e.target).parent('li');
                    var obj = self.shopTrl[curLi.attr('data-id')];
                    var arr = obj[0];
                    obj = [];
                    for (var i=0; i<val*1; i++) {
                        obj.push(arr);
                    }
                    self.shopTrl[curLi.attr('data-id')] = obj;
                    var price = 0;
                    $.each(self.shopTrl, function(key, value) {
                        price += value[0]['price'] * value.length;
                    });

                    if (price > 10000000) {
                        delete self.shopTrl[curLi.attr('data-id')];
                        sign = 2;
                        alert('总价不能大于1千万元，请修改商品数量', function() {}, '提示', '确定');
                    } else {
                        var op = self.$('.order_price');
                        var bp = self.$('.bargain_price');
                        //如果用户没有改动成交价，则改动成交价
                        if (op.text() == bp.val()) {
                            bp.val(price);
                        }

                        op.text(price);

                        self.barPrice = price;
                        sign = 0;
                    }
                } else if (temp.val() == '') {
                    temp.data('data-sign', '1');
                } else {
                    temp.removeData('data-sign');
                    sign = 1;
                }
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

        t_template: function() {
            var temp = _.template($('#trolley_layer_tpl').html(), {data: this.shopTrl});
            return temp;
        },

        render: function(state, data) {
            if (state == 0) {
                this.$('.tpl_part').html(this.m_template(data));
            } else if (state == 1) {
                this.$('.goods_list').html(this.c_template(this.collection.toJSON()));
            } else {
                $('#trolley_layer ul').html(this.t_template());
            }
        },

        events: {
            'touchstart .settle': 'taped',
            'touchend .settle': 'notap',
            'click .default_sort': 'defaultSort',
            'click .price_sort': 'priceSort',
            'click ul li': 'editPrice',
            'click .trolley_icon': 'toTrolley', //显示购物车页面
            'input .bargain_price': 'sfeffect',
            'click .settle': 'toSettlement',
            'focus .bargain_price': 'showBlurEffect',
            'blur .bargain_price': 'hideBlurEffect'
        },

        defaultSort: function() {
            this.$('.default_sort').addClass('taped');
            this.$('.price_sort').removeClass('taped');
            this.$('li').removeAttr('style');
        },

        liSort: function(arr) {
            var length = arr.length;
            for (var i=1; i<=length; i++) {
                this.$('li').eq(arr[i-1][0]).attr({style: '-webkit-box-ordinal-group: ' + i});
            }
        },

        bubbleSort: function(arr) {
            var length = arr.length;
            for (var i=1; i<length; i++) {
                for (var j=1; j<=length-i; j++) {
                    if (arr[j-1][1] > arr[j][1]) {
                        var temp = arr[j-1];
                        arr[j-1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
            var arr = this.$('.price_sort').hasClass('toLow') ? arr : arr.reverse();
            this.liSort(arr);
        },

        ascSort: function() {
            var arr = [];
            var li_length = pl.length;
            for (var i=0; i<li_length; i++) {
                arr.push([i, pl[i]['price']*1]);
            }
            this.bubbleSort(arr); //冒泡排序
        },

        priceSort: function() {
            this.$('.price_sort').addClass('taped').toggleClass('toLow');
            this.$('.default_sort').removeClass('taped');
            this.ascSort();
        },

        shopTrl: {},

        dealShopTrl: function(obj) {
            var stl = this.shopTrl;
            var id = obj.attr('data-id');
            stl[id] = this.shopTrl[id] || [];
            stl[id].push(pl[obj.index()]);
        },

        barPrice: 0,

        editPrice: function(e) {
            if (this.$('.order_price').text() * 1 <= 10000000) {
                var temp = $(e.currentTarget).children('.goods_name'),
                    ofst = temp.offset(),
                    offset = this.$('.trolley_icon').offset();

                var tempDiv = '<div class="testDiv" style="position: absolute; font-size: 17px; left:' + ofst.left + 'px; top: ' + ofst.top + 'px;">' + temp.text() + '</div>';
                $('body').append(tempDiv);

                $('body .testDiv').animate({left: offset.left + 'px', top: offset.top + 'px', 'font-size': '5px', opacity: 0.3}, 500, function() {
                        $(this).remove();
                });

                var objText = $(e.currentTarget).children('.price').text(),
                    op = this.$('.order_price'),
                    bp = this.$('.bargain_price');

                this.barPrice += objText * 1;

                //如果用户没有改动成交价，则改动成交价
                if (op.text() == bp.val()) {
                    bp.val(this.barPrice);
                }

                var obj = this.$('.trolley_icon span');
                obj.show();

                op.text(this.barPrice);
                obj.text(obj.text() * 1 + 1);

                //购物车存储数据
                this.dealShopTrl($(e.currentTarget));
            } else {
                alert('总价不能大于1千万元', function() {}, '提示', '确定');
            }
        },

        toTrolley: function() {
            $('#trolley_layer').height($('#enterWeidian').height());
            this.render(3);
            $('#trolley_layer').fadeIn(300);
            $(window).scrollTop(0);
            $('nav .leftButton').css('visibility', 'hidden'); // 隐藏导航栏返回按钮
        },

        sfeffect: function(e) {
            var obj = $(e.target);
            if (obj.val().length > 8) {
                obj.val(obj.val().slice(0, -1));
            }
        },

        toSettlement: function() {
            var obj = this.$('.settle');
            var aObj = this.$('.bargain_price');
            var reg = /^(?:[1-9][0-9]*(?:\.[0-9]+)?|0(?:\.[0-9]+)?)$/;
            if (aObj.val() == '') {
                alert('成交价不能为空', function() {}, '提示', '确定');
            } else if (!reg.test(aObj.val())) {
                alert('输入信息格式有误，请检查', function() {}, '提示', '确定');
            } else if (Object.keys(this.shopTrl).length == 0) {
                alert('请至少选择一件商品', function() {}, '提示', '确定');
            } else if (aObj.val() * 1 < 10) {
                alert('成交价不能小于十元', function() {}, '提示', '确定');
            } else if (aObj.val() * 1 > 10000000) {
                alert('成交价不能大于一千万元', function() {}, '提示', '确定');
            } else {
                sessionStorage.amount = (aObj.val() * 1).toFixed(2);
                sessionStorage.shopTrl = JSON.stringify(this.shopTrl);
                app_router.navigate(this.$('.settle').attr('rel'), {trigger: true});
            }
        },

        showBlurEffect: function() {
            this.$('.tpl_part, .sort_column, .goods_list').addClass('blur');
        },

        hideBlurEffect: function() {
            this.$('.tpl_part, .sort_column, .goods_list').removeClass('blur');
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

    var enterWeidianView = new EnterWeidianView();

    return {
        init: function(step) {
            if (step == '1') {
                // 从首页跳转到此页，初始化相关数据
                $('.order_price, .trolley_icon > span').text('0');
                $('.bargain_price').val('0');
                $('#trolley_layer ul').children().remove();
                enterWeidianView.shopTrl = {};
                enterWeidianView.barPrice = 0;
                curStep = step;

                $('#loading').fadeIn(200);
                //从后端获取数据
                enterWeidianView.model.fetch();
            } else {
                require.async('../nav', function(nav) {
                    nav.init(step, ntText);
                });
            }
        }
    };
});