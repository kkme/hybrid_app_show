
/**
 * 订单列表
 */
define(function(require, exports) {
	var type;
	$('.rightButton').on('tap', function() {
		C.OrderList.showOrderList($("[class='" + type + " nav-item']"));
	});

	var _config = C.Config,
		_cache = C.DataCache,
		_tool = C.Tool;
	
	/**
	 * 订单列表单元数据模型
	 * @class ItemModel
	 * @name ItemModel
 	 */
	var ItemModel = Backbone.Model.extend({});
	
	/**
	 * 订单列表数据集合
	 * @class ItemCollection
	 * @name ItemCollection
 	 */
 	var ItemCollection = Backbone.Collection.extend({
 		model: ItemModel,
 		//localStorage: new Store('JczqSpfMatch'),
 		/**
		 * initialize
 		 */
 		initialize: function() {
			this.frag = document.createDocumentFragment();
			this.bind('add', this.addItem, this);
 		},
		/**
		 * add
 		 */
 		addItem: function(model, models, option) {
			//屏蔽奥运彩票显示
			if(model.lotteryCode !== 24){
                var itemView = new ItemView({model: model});
				$(this.frag).append(itemView.render().$el);
			}
			
			// if (option.index === (this.length - 1)) {
				C.OrderList.append(this.frag);
			// }
 		}
	});

	/**
	 * 订单列表视图
	 * @class ItemView
	 * @name ItemView
	 */
	var ItemView = Backbone.View.extend({
		tagName: 'li',
		className: 'order-item',
		events: {
			'click': 'showOrderDetail',
			'touchstart': 'taped',
			'touchend': 'untaped'
		},
		_template: $('#order-item-template').html(),
		render: function() {
            $(this.el).html(_.template(this._template, this.model.toJSON())).attr('id', 'item-' + this.model.get('idHelper'));
			return this;
		},
		/*
		 * 二态
		 */
		taped: function(e){
			var obj = $(e.currentTarget);
			obj.addClass('taped');
		},
		untaped: function(e){
			var obj = $(e.currentTarget);
			obj.removeClass('taped');
		},
		/**
		 * 显示订单详情
		 * @name showOrderDetail
		 */
		showOrderDetail: function(e) {
			//付款
			if ($(e.target).hasClass('pay')) {
				C.Mode.pay(this.model.toJSON(), $(e.target));
				return;
			}

			//存储该订单相关信息（变量/本地存储）
			var model = this.model.toJSON();
			_cache.item = model;
			localStorage.removeItem('order-item');
			localStorage.setItem('order-item', JSON.stringify(model));
				
			C.Layout.setListSelect($(e.currentTarget));
			C.Layout.setDetailRoute(model);
                                        C.Layout.setLayout('detail', _cache.item.idHelper);
		}
	});

	/**
	 * 选号盘应用视图
	 * @class BallApp
	 * @name BallApp
	 */
	var ListApp = Backbone.View.extend({
		el: '#order-list',
		collection: new ItemCollection(),
		events: {
			'click .nav-item': 'showOrderList',
			'click .more': 'getMoreData',
			'click .back': 'back'
		},
		initialize: function() {
			//Hook
			this.loading = $('#order-list .loading');
			this.navs = $('#order-nav li');
			this.content = $('#order-list-con');
			this.more = $('#order-list .more');
		},
		/**
		 * 清空
		 * @name clearContent
		 * @param {node/string} frag 
		 */
		clearContent: function() {
			this.content.empty();
		},
		/**
		 * 拉取数据
		 * @name getData
		 * @param {string} list  列表类型 
		 * @param {boolean} tag  false(default): 覆盖/true: 添加 
		 */
		getData: function(list, tag) {
			//tab切换
			this.navs.removeClass('selected').filter('.' + list).addClass('selected');

			//清空列表
			if (!tag) {
				this._add = false;            //覆盖标识
				this.collection.reset(); 
				this.clearContent();
			} else {
				this._add = true;             //覆盖标识
			}
			this.showLoading(true);
			this.showMore(false);

			_cache.listType = list;
//			var url = _config.getDomain() + _config.list_interface + '?callback=C.OrderList.handleData&' + _config.data_username + '=' + _config.data_user + '&pageNumber=' + _cache.pageInfo.page + ((list === 'lucky') ? '&isWin=true' : '');

//			_tool.getScript(url);
        
           var url = '';
           var offset = _cache.pageInfo.page * 10 - 9;
           var application = "";
           // 中奖订单
           if (_cache.listType === "lucky") {
               _config.data_env = 'reward_pro';
               application = _config.getDomain();
           }
           // 全部订单
           else {
               _config.data_env = 'pro';
               application = _config.getDomain();
           }
           var postData = {
               application: application,
               offset: offset.toString(),
               mobileNo: context.user.mobileNo
           };
           jfpal.safeAjax(url, postData, this.handleData.bind(this), function(err) {
           	   alert(err, function() {}, '提示');
           });
		},
		/**
		 * 处理数据
		 * @name setData
		 * @param {node/string} frag 
		 */
		handleData: function(data) {
            var self = this;
            this.showLoading(false);
            if(data.respCode == "0000"){
               var list = _cache.listType,
               page,
               pageSize;
               //订单为空
               if (data.resultBean.length == 0) {
                   this.exception('亲，您还没有' + ((list === 'lucky') ? '中奖' : '购彩')  + ', 赶紧去投注吧!');
                   return;
               }
               
               _.each(data.resultBean, function(m) {
                      // list != 'lucky' -> 全部订单;  orderStatus ==  05(已中奖未派奖) || 07(已派奖) -> 中奖订单
//                      if (list != "lucky" || m.orderInfo.orderStatus == "05" || m.orderInfo.orderStatus == "07") {
                    var orderInfoObj = m.orderInfo;
                    var orderDetailObj = m.detailInfo;
                    // 注数
                    var totalStake = 0;
                    // 订单id
                    orderInfoObj.idHelper = orderInfoObj.orderNo;
                    // 默认订单方式:代购
                    orderInfoObj.orderType = 0;
                    // 彩票类型
                    orderInfoObj.lotteryType = orderInfoObj.lotteryId;
                    // 计算中奖总额
                    orderInfoObj.winFee = Number(orderInfoObj.awardAmt) / 100;
                    // 订单金额
                    orderInfoObj.orderAmt = Number(orderInfoObj.orderAmt) / 100;
                      
                    // 计算中奖总额、订单注数
                    _.each(orderDetailObj, function(n) {
                           totalStake += Number(n.betAmt) / 100 / 2 / n.multiple;
//                             orderInfoObj.winFee = orderInfoObj.winFee + parseInt(n.awardAmt);
                    });

                    orderInfoObj.orderDetail = orderDetailObj;
                    orderInfoObj.totalStake = totalStake;
                  
                    self.collection.add(orderInfoObj);
//                      }
               });

               // 最后一批数据
               if (data.summary.isLast === "1")
               {
                   this.showMore(false);
               } else {
                   this.showMore(true);
                   C.Layout.refreshScroll(this.scroll, this._add);
               }
            }else{
                alert('获取数据失败，请稍后再试',function(){},'提示');
            }
		},
		/**
		 * 插入HTML文档片段
		 * @name append
		 * @param {node/string} frag  文档片段
		 * @param {array} models  数据模型
		 */
		append: function(frag) {
			this.content.append(frag);

			//scroll
			if (typeof this.scroll === 'undefined') {
//				this.scroll = C.Layout.buildScroll('scrollview-list-con');
			} else {
				C.Layout.refreshScroll(this.scroll, this._add);
			}
			
			//init detail route
			if (_cache.item === null) {
				var model = this.collection.models[0].toJSON();
				_cache.item = model;
				localStorage.removeItem('order-item');
				localStorage.setItem('order-item', JSON.stringify(model));		
				C.Layout.initDetailRoute(model);
			}
			//C.Layout.setLayout('detail', _cache.item.idHelper);
		},
		/**
		 * 显示/隐藏 loading
		 * @name showLoading
		 * @param {boolean} tag  false(default):隐藏/true:显示
		 * @param {boolean} isLow  false(default):100px/true:20px
		 */
		showLoading: function(tag, isLow) {
			if (tag) {
				isLow && this.loading.css('padding', '20px 0');
				this.loading.removeClass('hidden');
				return;
			}
			this.loading.css('padding', '100px 0').addClass('hidden');
		},
		/**
		 * 显示/隐藏 更多订单
		 * @name showMore
		 * @param {boolean} tag  false(default):隐藏/true:显示
		 */
		showMore: function(tag) {
			if (tag) {
				this.more.removeClass('hidden');
				return;
			}
			this.more.addClass('hidden');
		},
		/**
		 * 异常处理
		 * @name exception
		 * @param {string} str  异常内容
		 */
		exception: function(str) {
			var li = this.content.find('li.exp');
			if (!li.length) {
				li = $('<li class="exp"></li>');
				this.content.append(li);
			}
			li.html(str);
						
			C.Layout.refreshScroll(this.scroll, this._add);
		},
		/**
		 * 显示订单列表
		 * @name showOrderList
		 */
		showOrderList: function(e) {
			type = e.attr('rel');
                                       
			if (type !== _cache.listType) {
				//重置分页
				C.DataCache.resetPage();
				C.Layout.setListRoute(type);
			}
		},
		/**
		 * 获取更多订单
		 * @name getMoreData
		 */
		getMoreData: function() {
			_cache.pageInfo.page ++;
			this.showLoading(true, true);
			this.getData(_cache.listType, true);		
		},
		/**
		 * 返回
		 * @name back
		 */
		back: function() {
			C.Mode.back();
		}

	});

	return {
		initialize: function(list){
			if (typeof C.OrderList === 'undefined') {
				C.OrderList = new ListApp();
				C.OrderList.$el.removeClass('hidden');
			}
			//拉取数据（每次重新拉取）
			if (list !== _cache.listType) {
				C.OrderList.getData(list);
			}

			C.Layout.setLayout('list');
			C.Mode.setToolBar();
           
            var rightStr = "";
            var centerStr = "";
            if (list === "lucky") {
                rightStr = "我的订单";
                centerStr = "中奖订单";
                type = "all";
            }
            else {
                rightStr = "中奖订单";
                centerStr = "我的订单";
                type = "lucky";
                $('.rightButton').css('visibility', 'visible');
            }

            $('.navTitle').text(centerStr);
            $('.rightButton').text(rightStr);
       
            // jfpal.navigation.setTitle(centerStr);
            // jfpal.navigation.setupRightButton(rightStr, "v2_right_add_normal.png", function() {
            //     C.OrderList.showOrderList($("[class='" + type + " nav-item']"));
            // });
		}
	};

}); 
