
/**
 * 声明seajs模块
 */
define(function(require,exports,module){
	var FilterModel = Backbone.Model.extend({});

	/**
	 * 订单列表视图
	 * @class ItemView
	 * @name ItemView
	 */
	var FilterView = Backbone.View.extend({
		el: '#extra',
		events: {
			'click #filter li': 'setCheck'
		},
		_template: $('#FilterTemp').html(),
		initialize: function() {
			this._obj = arguments[1];
			this.model = new FilterModel();
			this.model.bind('change', this.render, this);
			//赋值
			this.model.set(arguments[0]);
		},
		render: function() {
			var self = this;
			
			//跳转之后触发的render
			if (!self._tag) {
				if (typeof jfpal !== 'undefined') {
					jfpal.navigation.setTitle('赛事筛选');
					jfpal.navigation.setRightItemTitle('确定');
				}
				C.Config.leftBar = function() {
					self.cancel(self);
				};
				C.Config.rightBar = function() {
					self.confirm(self);
				};

				self._filter = JSON.stringify(self.model);   //缓存filter对象，取消时重新赋值

				$(self.el).html(_.template(self._template, self.model.toJSON()));

				self._tag = true;
				self.el_num = $(self.el).find('.num');
				
				return self;
			}
			
			//设置选中之后触发的render
			_.delay(function() {
				self.el_num.html(self.model.get('length'));
			}, 100);
			return self;
		},
		//设置选中
		setCheck: function(e) {
			var tar = $(e.currentTarget);
			if (tar.hasClass('disable')) {
				return;
			}
			_.toggleClass(tar, 'on');

			//change model
			var obj = this.model.toJSON(),
				data = obj.data,
				key = tar.html(),
				len = 0;
			
			data[key].select = !data[key].select;
			for (var k in data) {
				var v = data[k];
				if (v.select) {
					len += v.num;
				}
			}
			this.model.set('length', len);  //触发render
		},
		//取消
		cancel: function(self) {
			self.model.set(JSON.parse(self._filter), {silent: true});
			self.confirm(self);
		},
		//确定
		confirm: function(self) {
			self._tag = false;
			self._obj.filterCallBack();
		}
	});
	
	return {
		view: FilterView
	}
});
