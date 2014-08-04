
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var ItemModel = Backbone.Model.extend({
		initialize: function() {
			//设置ID
			this.set('id', this.get('matchOrder'));
 		}
	});
	
	/**
	 * 对阵列表数据集合
	 * @class ItemCollection
	 * @name ItemCollection
 	 */
 	var ItemCollection = Backbone.Collection.extend({
 		model: ItemModel,
 		/**
		 * initialize
 		 */
 		initialize: function(obj) {
			this._obj = obj;       //ItemCollection实例所属对象
			this.frag = document.createDocumentFragment();
			this.bind('add', this.addItem, this);
 		},
		//添加一条数据
		addItem: function(model, models, option) {
			var itemView = new ItemView({model: model});
			$(this.frag).append(itemView.render().$el);
			
			if (option.index === (this.length - 1)) {
				this._obj.append(this.frag);
			}
 		}
	});

	/**
	 * 对阵列表视图
	 * @class ItemView
	 * @name ItemView
	 */
	var ItemView = Backbone.View.extend({
		tagName: 'dl',
		events: {
			'click dd': 'setSelect' 
		},
		_template: $('#ItemTemp').html(),
		//渲染数据
		render: function() {
			var obj = this.model.toJSON();

			//下拉刷新时根据已选项重设模板数据（下拉刷新暂时删除）
			var match = C.DataCache.matches[obj.matchOrder];
			obj.win = match.win;
			obj.even = match.even;
			obj.negative = match.negative;
			
			//下拉刷新时根据筛选条件判断该条目是否显示（下拉刷新暂时删除）	

			//查看更多时根据筛选条件判断该条目是否显示
			if (C.DataCache.filterView && !C.DataCache.filterView.model.get('data')[obj.gameName].select) {
				$(this.el).addClass('hidden');	
			}

			//渲染数据
			$(this.el).html(_.template(this._template, obj)).attr('data-gameName', obj.gameName);

			C.DataCache.issueId = obj.issueId;    //设置彩期
			return this;
		},
		//点击设置选中
		setSelect: function(e) {
			//不可点击，直接返回
			var tar = $(e.currentTarget);
			if (tar.hasClass('disable')) {
				return;
			}
			_.toggleClass(tar, 'on');
					
			//model change
			var key = this.model.get('matchOrder'),
				val = tar.attr('data-value'),
				obj = C.DataCache.matches[key];

			obj[val] = !obj[val]; 
			obj.selectNum = Number(obj.win) + Number(obj.even) + Number(obj.negative); 	//选取结果个数

			key = (C.Config.lotteryType == 16) ? this.model.get('issueId') + '' + key : key;
			C.DataCache.historyMatch[key] = {
				win: obj.win,
				even: obj.even,
				negative: obj.negative
			};
			localStorage.setItem(C.Config.lotteryTypeName, JSON.stringify(C.DataCache.historyMatch));

			C.DataCache.trigger('match-change');
		}	
	});
	
	return {
		collection: ItemCollection
	}
});
