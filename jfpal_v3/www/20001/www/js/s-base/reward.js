
/**
 * 声明seajs模块
 */
define(function(require, exports, module){	
	var Tool = require('../base/tool'),
		Layout = require('./layout');

	var ItemModel = Backbone.Model.extend({});
	
	/**
	 * 开奖结果列表数据集合
	 * @class ItemCollection
	 * @name ItemCollection
 	 */
 	var ItemCollection = Backbone.Collection.extend({
 		model: ItemModel
	});

	/**
	 * 订单列表视图
	 * @class ItemView
	 * @name ItemView
	 */
	var ItemView = Backbone.View.extend({
		events: {
			'click .hd': 'toggleCallapse'
		},
		_template: $('#ItemTemp').html(),
		render: function() {
			var obj = this.model.toJSON();
			$(this.el).html(_.template(this._template, obj));
			return this;
		},
		toggleCallapse: function(e) {
			e.stopPropagation();
			_.toggleClass($(e.currentTarget).find('s'), 'fold');
			_.toggleClass($(e.currentTarget).siblings(), 'collapse');
		}
	});

	var AppView = Backbone.View.extend({
		el: '#main',
		initialize: function(cfg) {
			//配置
			cfg = $.extend({}, cfg);
			Tool.buildCfg.call(this, cfg);
			
			var self = this;
			C.Config.leftBar = function() {
				C.Config.changeUrl('index-alipay-native-app.html#!reward/2', $('#simulateDom')[0]);
			};
			C.Config.rightBar = function() {
				self.change(self);
			};
			//setLayout
			Layout.initialize().renderView('#rewardTemp', '#main');
			
			//初始化控件
			this.getData();
		},
		initReward: function(data) {
			var self = this;
			Layout.removeTransBox();
			$('#matchBox').empty();

			if (data.status !== 'ok') {
				$('#loading').html(C.Config.exception[data.resultCode]).removeClass('hidden');
				return;
			}

			if (data.results.length == 0) {
				$('#loading').html('<div class="reward-empty">很抱歉，今日无开奖数据</div>').removeClass('hidden');
				return;
			}

			if (!self.collection) {
				self.collection = new ItemCollection();
				self.collection.bind('reset', self.renderMatch, this);
			}

			self.collection.reset(data.results);
		},
		renderMatch: function() {
			var frag = document.createDocumentFragment();
			this.collection.each(function(model){
				var itemView = new ItemView({model: model});
				$(frag).append(itemView.render().$el);
			});

			$('#main .loading').addClass('hidden');
			$('#main #matchBox').append(frag);
		}
	});

	return {
		reward: AppView
	}
});
