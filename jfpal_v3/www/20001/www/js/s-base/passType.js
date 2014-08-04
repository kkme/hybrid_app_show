
/**
 * 声明seajs模块
 */
define(function(require,exports,module){
	var PassTypeModel = Backbone.Model.extend({});

	/**
	 * 过关方式视图
	 * @class ItemView
	 * @name ItemView
	 */
	var PassTypeView = Backbone.View.extend({
		el: '#extra',
		events: {
			'click #passType li': 'setCheck',
			'click  #treaty': 'showTreaty',
			'keyup #bt': 'setBt'
		},
		_template: $('#PassTypeTemp').html(),
		initialize: function() {
			this._obj = arguments[1];
			this.model = new PassTypeModel();
		},
		render: function() {
			var self = this;
			
			//设置工具栏
			if (typeof jfpal !== 'undefined') {
			    jfpal.navigation.setTitle('过关方式');
				jfpal.navigation.setRightItemTitle('确定');
			}
			C.Config.leftBar = function() {
				self.cancel(self);
			};
			C.Config.rightBar = function() {
				self.confirm(self);
			};
			
			self._passType = C.DataCache.passType;  //缓存passType，取消时重新赋值

			$(self.el).html(_.template(self._template, self.model.toJSON()));
			
			return self;			
		},
		//设置选中
		setCheck: function(e) {
			var tar = $(e.target);
			if (tar.hasClass('disable')) {
				return;
			}
			_.toggleClass(tar, 'on');
			
			var a = [], key = tar.html();
			if (tar.hasClass('on')) {
				a.push(key);
				a = _.union(C.DataCache.passType, a);
			} else {
				a = _.without(C.DataCache.passType, key);
			}

			C.DataCache.passType = a;
			
			_.delay(function() {
				//重新计算金额
				C.DataCache.trigger('calculate', {
					callback: function() {
						$('#extra .num').html(C.DataCache.betNum);
						$('#extra .money').html(C.DataCache.betFee);
					}
				});			
			}, 100);
		},
		//设置倍投
		setBt: function(e) {
			var tar = $(e.target),
				bt = Math.min(C.Config.maxBt, Number(tar.val()));
	
			bt = isNaN(bt) ? 1 : bt;
			tar.val((bt == 0) ? '' : bt);
			C.DataCache.bt = bt;
			
			//重新计算金额
			C.DataCache.trigger('calculate', {
				callback: function() {
					$('#extra .num').html(C.DataCache.betNum);
					$('#extra .money').html(C.DataCache.betFee);
				}
			});			
		},
		showTreaty: function(){
			if(C.Config.platform === 'ios'){
				jfpal.navigation.pushWindow('treaty.html');
			} else {
				localStorage.setItem('trigTreaty', location.href);
				C.Config.changeUrl('treaty.html',  $('#simulateDom')[0]);
			}
		},
		//确定
		cancel: function(self) {
			C.DataCache.passType = self._passType;
			C.DataCache.trigger('calculate', {
				callback: function() {
					self.confirm(self);
				}
			});	
		},
		//确认
		confirm: function(self) {
			$('#passType').remove();
			self._obj.passTypeCallBack();
		}
	});
	
	return {
		view: PassTypeView
	}
});
