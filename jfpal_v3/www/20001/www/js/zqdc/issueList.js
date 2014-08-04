
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var IssueListModel = Backbone.Model.extend({});

	/**
	 * 对阵列表视图
	 * @class ItemView
	 * @name ItemView
	 */
	var IssueListView = Backbone.View.extend({
		el: '#issueList',
		events: {
			'click dd': 'setSelect' 
		},
		_template: $('#IssueTemp').html(),	
		initialize: function() {
			this._obj = arguments[1];
			this.model = new IssueListModel();
		},
		//渲染数据
		render: function() {
			var obj = this.model.toJSON();
			//渲染数据
			$(this.el).html(_.template(this._template, obj));
			return this;
		},
		//点击设置选中
		setSelect: function(e) {
			e.stopPropagation();
			//不可点击，直接返回
			var tar = $(e.currentTarget);
			if (tar.hasClass('disable')) {
				return;
			}
			this.$el.find('dd').removeClass('on');
			tar.addClass('on');
			this._obj.triggerChange(tar);
		}	
	});
	
	return {
		view: IssueListView
	}
});
