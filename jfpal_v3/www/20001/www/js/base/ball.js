/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Tool = require('./tool');
	var BallModel = Backbone.Model.extend({});
	var BallCollection = Backbone.Collection.extend({
		model: BallModel,
		initialize: function(cfg){
			cfg = $.extend({
				lines: 2,
				key: 'ssq_common',
				localStorage: new Store('ssqcommonball'),
				deviation: 0,
				/**
				 * 验证是否符合此玩法的选号规则
				 */
				verify: function(){},
				/**
				 * 获取投注字符串数组
				 */
				getBetArray: function(){},
				getBetString: function(){}
			},cfg);
			Tool.buildCfg.call(this,cfg);
			this.bind('add',this.addOne,this);
			this.bind('remove',this.removeOne,this);
			this.bind('reset',this.addAll,this);
		},
		
		/**
		 * 选号球集合增加单个模型的回调
		 * @param model{model} 模型
		 * @memberOf BallCollection
		 * @return void
		 */
		addOne: function(model){
			var ballview = new BallView({
				model:model,
				el: '#' + this.key,
				deviation: this.deviation
			});
			ballview.render();
		},
		/**
		 * 选号球集合增加所有模型的回调
		 * @memberOf BallCollection
		 * @return void
		 */
		addAll: function(){
			var self = this;
			this.each(function(model){
				self.addOne(model);
			});
		},
		/**
		 * 选号球集合删除模型回调
		 * @memberOf BallCollection
		 */
		removeOne: function(model){
			var ballview = new BallView({
				model: model,
				el: '#' + this.key,
				deviation: this.deviation
			});
			ballview.render();
		},
		
		/**
		 * 获取单行选号球已经选择号码的个数
		 * @param index{number} 行数
		 * @memberOf BallCollection
		 * @return number
		 */
		fetchSelectNum: function(index){
			var arr = this.toJSON();
			var filterArr =	_.filter(arr,function(val){
				return val.line == index;
			});	
			return filterArr.length;
		},
		/**
		 * 同步选号球数据到集合
		 * @param state{boolean} sync数据的性质，true->add  false->delete
		 * @param arr{array} 同步的选号数据数组,如[{line:0,val:'07'},{line:0,val:'08'}]
		 * @return this
		 * @memberOf BallCollection
		 */
		syncData: function(state,arr){
			var _self = this;
			if(state){
				_.each(arr,function(n){
					_self.create(new _self.model({
						line: n.line,
						val: n.val
					}));
				});	
			}else{
				_.each(arr,function(n){
					var modelCid = _self.fetchModelCid({
						line: n.line,
						val: n.val
					});	
					_self.get(modelCid).destroy();
				});
			}
			return _self;
		},
		/**
		 * 根据特定对象查找集合中数据模型的Cid
		 * @param obj{object} 特定对象，如{line: 0, val:"09"}
		 * @memberOf BallCollection
		 * @return modelId
		 * @type string
		 */
		fetchModelCid: function(obj){
			var result = '';
			_.each(this.models,function(model){
				if(model.get('line') == obj.line && model.get('val') == obj.val){
					result = model.cid;
				}
			});
			return result;
		},
		/**
		 * 获取选号盘产生的选号数组
		 * @param void
		 * @memberOf BallCollection
		 * @return result [['01','02','03','04','05','06'],['11']]
		 * @type array
		 */
		getSelectArray: function(){
			var arr = this.toJSON(),
				result = [];
			for(var i=0;i<this.lines;i++){
				var a =	_.filter(arr,function(val){
					return val.line == i;
				});
				var n = [];
				for(var j=0,len=a.length;j<len;j++){
					n.push(a[j].val);	
				}
				n = n.sort();
				result.push(n);
			}
			return result;
		},
		/**
		 * 清空集合中所有的数据模型
		 * @name clear
		 * @memberOf BallCollection
		 */
		clear: function(){
			for(var i=this.models.length;i--;){
				this.models[i].destroy();
			}
		}
	});
	
	var BallView = Backbone.View.extend({
		initialize: function(cfg){
			cfg = $.extend({
				el: '#ssq_common',
				deviation: 0
			},cfg);
			Tool.buildCfg.call(this,cfg);
		},
		/**
		 * 选号渲染方法
		 * @memberOf BallView
		 */
		render: function(){
			var els = this.$el.find('.ballList').eq(this.model.get('line')).find('li'),
				tarel = els.eq(Number(this.model.get('val')) + this.deviation);
			tarel.hasClass('select') ? tarel.removeClass('select') : tarel.addClass('select');
		}
	});
	
	
	/**
	 * 选号盘应用视图
	 * @class BallApp
	 * @name BallApp
	 */
	var BallApp = Backbone.View.extend({
		el: '#ssq_common',
		/**
		 * 初始化
		 * @memberOf BallApp
		 * return void
		 */
		initialize: function(cfg){
			this.setKey().setStep(cfg.step);
			C.Config.setToolBar();
			this.handleEdit();
			this.getIssue();
		},
		getIssue: function(){
//                                       alert('getIssue');
            //{"resultBean":[{"lotteryCode":"05","periodNo":"2012031","startTime":"20120301120000","endTime":"20120302120000","awardTime":"20120303120000","canSoldFlag":"0","countDownTime":"100000"}] }。
			/*var botTool = $('#botTool');
			if(botTool.length > 0){
				var lotType = C.Config.lotTypeNumberId[C.Config.key.split('_')[0]];
				var url = C.Config.getIssueDataUrl() + '?typeId=' + lotType + '&callback=C.' + C.Config.key.replace('_','') + 'ballapp.handleIssue&t=' + new Date().getTime();
				Tool.getScript(url);
			}*/
		},
		handleIssue: function(obj){
			var issue = $('#botTool .issue');
			if(obj.results.length <= 0){
				issue.html('获取彩期失败');
			}else{
				issue.html('第' + obj.results[0].issue + '期');	
			}
		},
		events: {
			'tap .abacus li': 'callback',
			'click .header .type': 'done',
			'click #selPlayType li': 'switchType',
			'click .return' : 'returnBet'
		},
		//返回投注页
		returnBet: function(e){
			if(e){
				e.preventDefault();
			}
			var obj = this.$('.return');
			this.collection.clear();
			C.Config.changeUrl(obj.attr('href'));
		},
		/**
		 * 切换子玩法
		 * @memberOf BallApp
		 * @name switchType
		 */
		switchType: function(e){
			var obj = $(e.currentTarget),
				rel = obj.attr('rel'),
				step = '',
				arr = rel.split('_');
			step = '/3';
			var hash = '#!' + arr[0] + '/' + arr[1] + step;
			C.Config.changeUrl(hash);
		},
		/**
		 * 结束选号去投注
		 * @memberOf BallApp
		 */
		done: function(e){
			var verify = this.collection.verify();
			if(verify !== true){
				alert(verify,function(){},'提示');
				e.preventDefault();
			}
		},
		/**
		 * 设置key值，用于玩法标识
		 * @memberOf BallApp
		 * return BallApp
		 */
		setKey: function(){
			C.Config.key = this.collection.key;
			return this;
		},
		/**
		 * 保存当前step到配置项，用于计算页面推送方向
		 * @memberOf BallApp
		 * @return BallApp
		 */
		setStep: function(number){
			C.Config.step = Number(number);
			return this;
		},
		/**
		 * 点击选号球的回调
		 * @memberOf BallApp
		 * @param e{event} 事件
		 */
		callback: function(e){
			var obj = $(e.currentTarget),
				lines = this.$el.find('.ballList'),
				line = lines.index(obj.parent('.ballList')),
				val = obj.html();
                                       
			switch(val){
				case '大':
					val = 0;
					break;
				case '小':
					val = 1;
					break;
				case '单':
					val = 2;
					break;
				case '双':
					val = 3;
					break;
				default:
					break;
			}
			if(!obj.hasClass('select')){
				this.collection.syncData(true,[{line:line,val:val}]);
				//两行之间是否可以选择同一个号码
				if(this.options.noRepeat){
					for(var i = 0; i< this.collection.models.length;i++){
						if(this.collection.models[i].get('val') == val && this.collection.models[i].get('line') !== line){
							this.collection.syncData(false,[{
								line: this.collection.models[i].get('line'),
								val: val
							}]);
						}
					}
				}
			}else{
				this.collection.syncData(false,[{line:line,val:val}]);	
			}
		},
		/**
		 * 处理编辑单注的回调
		 * @memberOf BallApp
		 */
		handleEdit: function(){
			//如果待编辑单注为空
			if(_.isEmpty(C.Config.editModel[C.Config.key])) return;
			this.collection.clear();
			var result = [];
			_.map(C.Config.editModel[C.Config.key],function(val,key){
				
				_.each(val,function(n){
					result.push({
						line: Number(key.replace('l','')) - 1,
						val: n
					});
				});
			});
			this.collection.syncData(true,result);
			C.Config.editModel[C.Config.key] = [];
		}
	});

	return {
		Collection: BallCollection,
		Model: BallModel,
		App: BallApp		
	};
});
