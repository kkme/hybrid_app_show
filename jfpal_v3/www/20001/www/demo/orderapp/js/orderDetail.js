
/**
 * 订单详情流程启动
 */
define(function(require, exports) {
	var _config = C.Config,
		_cache = C.DataCache,
		_tool = C.Tool,
		_lottery = C.Lottery;
	
	/**
	 * 订单详情单元数据模型
	 * @class DetailModel
	 * @name DetailModel
 	 */
	var DetailModel = Backbone.Model.extend({
		initialize: function() {
			this.bind('change', this.render, this);
 		},
		/**
		 * change
 		 */
 		render: function() {
			C.OrderDetail.render();
 		}
	});
	
	/**
	 * 订单详情视图
	 * @class DetailView
	 * @name DetailView
	 */
	var DetailView = Backbone.View.extend({
		el: "#order-detail",
		model: new DetailModel(),
		events: {
			'click button': 'toggleCollapse',
			'click .continueBuy': 'continueBuy',
			'click .pursue-item': 'toggleItem'
		},
		_template: {
			'n0': $('#order-detail-template-n-dg').html(),
			'n1': $('#order-detail-template-n-hm').html(),
			'n2': $('#order-detail-template-n-hm').html(),
			'n3': $('#order-detail-template-n-zh').html(),
			's0': $('#order-detail-template-s-dg').html(),
			's1': $('#order-detail-template-s-hm').html(),
			's2': $('#order-detail-template-s-hm').html(),
		},
		initialize: function() {
			//Hook
			this.loading = $('#order-detail .loading');
			this.content = $('#order-detail-con');
		},
		render: function() {
			//根据model类型选择模板
			var _model = this.model.toJSON();
			this.content.html(_.template(this._template[_lottery.getDetailTag(_model)], _model));

			//标红
			_lottery.addLuckyEffect($('.effect'), _model);

			//scroll
//			this.scroll = C.Layout.buildScroll('scrollview-detail-con');
			
			return this;
		},
		/**
		 * 清空
		 * @name clear
		 * @param {node/string} frag 
		 */
		clear: function() {
			this.content.empty();
		},
		/**
		 * 拉取数据
		 * @name getData
		 * @param {string} detail  订单ID（验证） 
		 */
		getData: function(detail) {
			//清空
			this.model.clear({silent: true}); 
			this.clear();
			C.Layout.destroyScroll(this.scroll);

			this.showLoading(true);
			
			var orderModel = _cache.item, 
				lotteryType, orderType, url;
			if (orderModel === null) {
				orderModel = JSON.parse(localStorage.getItem('order-item'));
			}

			//验证是否同一订单
			if (detail !== orderModel.idHelper) {
				return;
			}
			 _cache.item = orderModel;

			//缓存 lotteryType、orderType
			lotteryType = this.lotteryType = orderModel.lotteryType;
			orderType = this.orderType = orderModel.orderType;
                                        
            this.handleData();
                                      
//            console.log('fetch order detail in orderDetail.js');
//            var url = '';
//            var offset = 1;
//            var postData = {
//              application: _config.getDomain(),
//              offset: offset.toString(),
//              mobileNo: jfpal.user.mobileNo
//            };
//            jfpal.safeAjax(url, postData, this.handleData.bind(this));
		},
		/**
		 * 处理数据
		 * @name setData
		 * @param {node/string} frag 
		 */
		handleData: function() {
              this.showLoading(false);
              this.model.set(_cache.item);
              // 未付款订单
              // if (_cache.item.orderStatus == "00") {
              //     jfpal.navigation.setupRightButton("订单支付", "v2_right_add_normal.png", function() {
              //           C.Mode.pay(_cache.item);
              //     });
              // }                  

		},
		/**
		 * 显示/隐藏 loading
		 * @name showLoading
		 * @param {boolean} tag  false(default):隐藏/true:显示
		 */
		showLoading: function(tag) {
			if (tag) {
				this.loading.removeClass('hidden');
				return;
			}
			this.loading.addClass('hidden');
                                          
		},
		/**
		 * 异常处理
		 * @name exception
		 * @param {string} str  异常内容
		 */
		exception: function(str) {
			var div = this.content.find('.exp');
			if (!div.length) {
				div = $('<div class="exp"></div>');
				this.content.append(div);
			}
			div.html(str);
			C.Layout.refreshScroll(this.scroll);
		},
		toggleCollapse: function(e) {
			var triggerNode = $(e.target),
				infoNode = triggerNode.closest('dd').next();
			if (triggerNode.hasClass('fold')) {
				triggerNode.attr('class', 'unfold');
				infoNode.removeClass('no-visible');
			} else {
				triggerNode.attr('class', 'fold');
				infoNode.addClass('no-visible');
			}

			//sync scroll
			C.Layout.refreshScroll(this.scroll, true);
		},
		continueBuy: function() {
			C.Mode.continueBuy(this.model.toJSON());
		},
		toggleItem: function(e) {
			var triggerNode = $(e.currentTarget),
				tagNode = triggerNode.find('.issue'),
				infoNode = triggerNode.next();
			if (tagNode.hasClass('unfold')) {
				tagNode.attr('class', 'issue fold');
				infoNode.addClass('no-visible');
			} else {
				$('.pursue-item').each(function(index, item) {
					var _tagNode = $(item).find('.issue');
					if (_tagNode.hasClass('unfold')) {
						_tagNode.attr('class', 'issue fold');
						$(item).next().addClass('no-visible');
					}
				});	
				
				tagNode.attr('class', 'issue unfold');
				infoNode.removeClass('no-visible');

				if (triggerNode.attr('data-item') === 'false') {
					var model =  _cache.item, 
						url = _config.getDomain() + _config.getDetailInterface(model.orderType) + '?callback=C.OrderDetail.handlePursue&' + _config.data_username + '=' + _config.data_user + '&outerId=' + model.idHelper + '&typeId=' + model.lotteryType + '&issueId=' + triggerNode.attr('data-issue') + '&dbType=' + model.dbType;
					
					this.activePursueItem = {
						node: infoNode,
						trigger: triggerNode
					};
					_tool.getScript(url);
				}
			}
			
			//sync scroll
			C.Layout.refreshScroll(this.scroll, true);			
		},
		handlePursue: function(data) {
			var item = this.activePursueItem;
			this.activePursueItem = null;

			item.node.find('.loading').remove();
			item.trigger.attr('data-item', 'true');

			var arr = [],  sHtml = '',
				textNode = item.node.find('.info');
			_.each(data.orderNumber, function(order) {
				_.each(order.formatedLotteryNumbers, function(num) {
					arr.push(num + ' ' + order.multi + '倍');
				});							
			});

			sHtml = '投注号码: <div class="effect">' + arr.join('</br>') + '</div>' + textNode.html();
			textNode.html(sHtml).removeClass('hidden');
			
			//标红
			_lottery.addLuckyEffect(textNode.find('.effect'), this.model.toJSON());

			//sync scroll
			C.Layout.refreshScroll(this.scroll, true);
		}
	});

	return {
		initialize: function(detail){	
			if (typeof C.OrderDetail === 'undefined') {
				C.OrderDetail = new DetailView();
				C.OrderDetail.$el.removeClass('hidden');
			}
			//拉取数据（每次重新拉取）
			C.OrderDetail.getData(detail);

			C.Layout.setLayout('detail', detail);
			C.Mode.setToolBar();
		}		
	};	

});