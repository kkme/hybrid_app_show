define(function(require) {
    var curStep; // 哪个页面跳转过来的标志位

    // app首次启动,本地存储车站列表版本号
    if (!localStorage.version) {
        localStorage.version = '1.1';
    }
    // 连接数据库
    var dataBase = openDatabase('stationList', '1.0', '车站列表', 1024 * 1024);
       
    var Cities = Backbone.Collection.extend({
        sync: function() {
            var self = this;
            jfpal.safeAjax('', {application: 'GetStationHouseList', houseFlag: localStorage.version, mobileNo: context.user.mobileNo}, function(data) {
                if (data.summary.version != localStorage.version) {
                    self.isFirstTime(1, data.resultBean);
                } else {
                    self.isFirstTime(0);
                }
            }, function(error) {
                self.goBackUrl();
                $('#loading').fadeOut(200, function() {
                    alert(error.respDesc, function() {}, '提示', '确定');
                });
            });
        },
        // app首次启动,如果服务器端返回的版本号和本地相同,将StationHouse.json数据填充到web sql。
        isFirstTime: function(state, data) {
            var self = this;
            if (state == 0) { // 本地数据库不需要更新车站列表
                $.getJSON('../StationHouse.json', function(data) {
                    self.fillData(data);
                });
            } else { // 本地数据库需要更新车站列表
                self.fillData(data);
            }
        },
        // 本地数据库的相关操作
        fillData: function(data) {
            var self = this;
            if (dataBase) {
                dataBase.transaction(function(tx) {
                    tx.executeSql('create table if not exists stationList (id unique, initial text, name text)');
                    tx.executeSql('delete from stationList');
                    // 将StationHouse.json数据插入stationList表
                    var j = 0,
                        hotCity = {};
                    $.each(data.resultBean, function(key, value) {
                        if (key == '热门') {
                            hotCity = value;
                            return; // 不向数据库写入热门城市此项
                        }
                        for (var i=0; i<value.length; i++) {
                            j += 1;
                            tx.executeSql('insert into stationList (id, initial, name) values(?, ?, ?)', [j+'', key, value[i]['STATIONNAME']]);
                        }
                    });
                    self.reset(data.resultBean);
                    cityView.render(1, hotCity);
                    //数据请求成功后，开始显示此页
                    require.async('../nav', function(nav) {
                        nav.init(curStep);
                    });

                    $('#loading').fadeOut(200);
                });
            }
        },
        // 数据请求失败后，改回原来的hash值
        goBackUrl: function() {
            app_router.navigate('!index', {trigger: false});
        }
    });
       
    var CityView = Backbone.View.extend({
        el: '#city',

        collection: new Cities(),

        initialize: function() {
            var self = this;
            this.collection.on('reset', function() {
                self.render(0);
            });
        },

        template: function(collection) {
            var temp = _.template($('#city_tpl').html(), {collection: collection});
            return temp;
        },

        h_template: function(data) {
            var temp = _.template($('#hotCity_tpl').html(), {collection: data});
            return temp;
        },

        hs_templte: function(data) {
            var temp = _.template($('#history_tpl').html(), {data: data});
            return temp;
        },

        render: function(state, data) {
            if (state == 0) {
                this.$('.cityList').html(this.template(this.collection.toJSON()[0]));
            } else if (state == 1) {
                this.$('.hotCity').html(this.h_template(data));
            } else {
                this.$('.history').html(this.hs_templte(data));
            }
        },

        events: {
            'input .getCity': 'selected', // 注意,当input框里面是中文时,input事件触发两次,只能是不完美解决办法
            'tap .list li': 'toIndex',
            'tap .history li': 'toIndex',
            'tap .cityList li': 'toIndex',
            'tap .hotCity li': 'toIndex'
        },

        selected: function() {
            var self = this;
            // 下拉联想
            if ($('.getCity').val() == '') {
                $('.list').hide();
                self.$('.history, .hotCity, .cityList').show();
                return;
            }
            var val = $('.getCity').val();
            this.$('.list').empty();

            dataBase.transaction(function(tx) {
                tx.executeSql("select * from stationList where name like'" + val +"%'", [], function(tx, result) {
                    var length = result.rows.length;
                    $('.list').empty();
                    if (length != 0) {
                        for (var i=0; i<length; i++) {
                            $('.list').append("<li rel=''>" + result.rows.item(i)['name'] + "</li>");
                        }
                        $('.list').show();
                        self.$('.history, .hotCity, .cityList').hide();
                    } else {
                        $('.list').hide();
                        self.$('.history, .hotCity, .cityList').show();
                    }
                });
            });  
        },
                                       
        toIndex: function(e) {
            var obj = $(e.currentTarget);
            if (!obj.hasClass('first')) {
                if (obj.siblings('.first').text() == '历史') {
                    dT.station.dep_station = obj.find('.depart').text();
                    dT.station.des_station = obj.find('.desti').text();
                    step = '8';
                } else {
                    var step; // 首页何处渲染数据的标志位
                    if (curStep == '1') {
                        step = '2';
                        dT.station.dep_station = obj.text();
                    } else {
                        step = '3';
                        dT.station.des_station = obj.text();
                    }
                }
                app_router.navigate('!index/' + step, {trigger: true});
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

    var cityView = new CityView();
       
    return {
        init: function(step) {
            // 初始化相关数据
            curStep = step;
            $('#city .getCity').val('');
            $('#city .list').html('');
            $('.history, .hotCity, .cityList').show();

            $('#loading').fadeIn(200);
            if (localStorage.history) {
                cityView.render(2, JSON.parse(localStorage.history));
            }
            cityView.collection.fetch();
        }
    };
});