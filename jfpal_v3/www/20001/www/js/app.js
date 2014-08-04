
/**
 * 声明seajs模块
 */
define(function(require,exports,module){
	require('./config');
	require('./jfpal-config');

	(function() {
        if (device.platform == 'Android') {

        } else if (device.platform == 'iOS') {
        	$('.leftButton').addClass('show');
            if (device.version.indexOf('7') == 0 || device.version.indexOf('8') == 0) {
                $('nav, .appMenu, #wrapper').addClass('ios7');
            }
        }
    })();
	
	/**
	 * app控制器
	 */
	AppController = Backbone.Router.extend({
		routes: {
			'': 'nav',
			'!exception/:errcode': 'exception',
			'!newuser/3': 'newuser',
			'!nav/:step': 'nav',
			'!ssq/common/:step': 'ssqCommon',
			'!ssq/bet/:step': 'ssqBet',
			'!dlt/common/:step': 'dltCommon',
			'!dlt/bet/:step': 'dltBet',
			'!fc3d/zhx/:step': 'fc3dZhx',
			'!fc3d/zhxhz/:step': 'fc3dZhxHz',
			'!fc3d/zhx/bet/:step': 'fc3dZhxBet',
			'!fc3d/z3/:step': 'fc3dZ3',
			'!fc3d/z3hz/:step': 'fc3dZ3Hz',
			'!fc3d/z3/bet/:step': 'fc3dZ3Bet',
			'!fc3d/z6/:step': 'fc3dZ6',
			'!fc3d/z6hz/:step': 'fc3dZ6Hz',
			'!fc3d/z6/bet/:step': 'fc3dZ6Bet',
			'!qlc/common/:step': 'qlcCommon',
			'!qlc/bet/:step': 'qlcBet',
			'!swxw/common/:step': 'swxwCommon',
			'!swxw/bet/:step': 'swxwBet',
			
			/**
			 * 开奖公告
			 */
			'!reward/2': 'reward',
			'!reward/list/:type/3': 'rewardList'
		},
		

		syyQ1: function(step){
			//启动视图渲染
			require.async('./syy/q1',function(q1){
				q1.initialize(step);	
			});		
		},
		syyQ2Zhx: function(step){
			//启动视图渲染
			require.async('./syy/q2zhx',function(q2zhx){
				q2zhx.initialize(step);	
			});		
		},
		syyQ2Zx: function(step){
			//启动视图渲染
			require.async('./syy/q2zx',function(q2zx){
				q2zx.initialize(step);	
			});		
		},
		syyQ3Zhx: function(step){
			//启动视图渲染
			require.async('./syy/q3zhx',function(q3zhx){
				q3zhx.initialize(step);	
			});		
		},
		syyQ3Zx: function(step){
			//启动视图渲染
			require.async('./syy/q3zx',function(q3zx){
				q3zx.initialize(step);	
			});		
		},
		syyRx2: function(step){
			//启动视图渲染
			require.async('./syy/rx2',function(rx2){
				rx2.initialize(step);	
			});		
		},
		syyRx3: function(step){
			//启动视图渲染
			require.async('./syy/rx3',function(rx3){
				rx3.initialize(step);	
			});		
		},
		syyRx4: function(step){
			//启动视图渲染
			require.async('./syy/rx4',function(rx4){
				rx4.initialize(step);	
			});		
		},
		syyRx5: function(step){
			//启动视图渲染
			require.async('./syy/rx5',function(rx5){
				rx5.initialize(step);	
			});		
		},
		syyRx6: function(step){
			//启动视图渲染
			require.async('./syy/rx6',function(rx6){
				rx6.initialize(step);	
			});		
		},
		syyRx7: function(step){
			//启动视图渲染
			require.async('./syy/rx7',function(rx7){
				rx7.initialize(step);	
			});		
		},
		syyRx8: function(step){
			//启动视图渲染
			require.async('./syy/rx8',function(rx8){
				rx8.initialize(step);	
			});		
		},
		

		/**
		 * 十一运任选2投注
		 */
		syyRx2Bet: function(step){
			//启动视图渲染
			require.async('./syy/rx2bet',function(bet){
				bet.initialize(step);
			});		
		},
		syyRx3Bet: function(step){
			//启动视图渲染
			require.async('./syy/rx3bet',function(bet){
				bet.initialize(step);
			});		
		},
		syyRx4Bet: function(step){
			//启动视图渲染
			require.async('./syy/rx4bet',function(bet){
				bet.initialize(step);
			});		
		},
		syyRx5Bet: function(step){
			//启动视图渲染
			require.async('./syy/rx5bet',function(bet){
				bet.initialize(step);
			});		
		},
		syyRx6Bet: function(step){
			//启动视图渲染
			require.async('./syy/rx6bet',function(bet){
				bet.initialize(step);
			});		
		},
		syyRx7Bet: function(step){
			//启动视图渲染
			require.async('./syy/rx7bet',function(bet){
				bet.initialize(step);
			});		
		},
		syyRx8Bet: function(step){
			//启动视图渲染
			require.async('./syy/rx8bet',function(bet){
				bet.initialize(step);
			});		
		},
		syyQ1Bet: function(step){
			//启动视图渲染
			require.async('./syy/q1bet',function(bet){
				bet.initialize(step);
			});		
		},
		syyQ2ZhxBet: function(step){
			//启动视图渲染
			require.async('./syy/q2zhxbet',function(bet){
				bet.initialize(step);
			});		
		},
		syyQ2ZxBet: function(step){
			//启动视图渲染
			require.async('./syy/q2zxbet',function(bet){
				bet.initialize(step);
			});		
		},
		syyQ3ZhxBet: function(step){
			//启动视图渲染
			require.async('./syy/q3zhxbet',function(bet){
				bet.initialize(step);
			});		
		},
		syyQ3ZxBet: function(step){
			//启动视图渲染
			require.async('./syy/q3zxbet',function(bet){
				bet.initialize(step);
			});		
		},



		exception: function(errcode){
			require.async('./base/exception',function(exception){
				exception.initialize(errcode);
			});
		},
		newuser: function(){
			require.async('./base/userinfo',function(info){
				info.initialize();
			});
		},
		/**
		 * 开奖公告聚合页
		 */
		reward: function(){
			require.async('./reward/all',function(all){
				all.initialize();
			});
		},
		/**
		 * 开奖公告列表页（单彩种list）
		 */
		rewardList: function(type){
			require.async('./reward/list',function(list){
				list.initialize(type);
			});
		},
		/**
		 * 导航页逻辑
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		nav: function(step){
			require.async('./appnav/nav',function(nav){
				step = step || 1;
				nav.initialize(step);
			});
		},
		/**
		 * 双色球普通选号
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		ssqCommon: function(step){
			//启动视图渲染
			require.async('./ssq/common',function(common){
				common.initialize(step);
				$('#tabbar').hide();
			});
		},
		/**
		 * 双色球投注
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		ssqBet: function(step){
			//启动视图渲染
			require.async('./ssq/ssqbet',function(bet){
				bet.initialize(step);
			});		
		},
		/**
		 * 大乐透普通选号
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		dltCommon: function(step){
			//启动视图渲染
			require.async('./dlt/common',function(common){
				common.initialize(step);	
			});		
		},
		/**
		 * 大乐透投注
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		dltBet: function(step){
			//启动视图渲染
			require.async('./dlt/dltbet',function(bet){
				bet.initialize(step);
			});		
		},
		/**
		 * 福彩3d直选选号区
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		fc3dZhx: function(step){
			//启动视图渲染
			require.async('./fc3d/zhx',function(zhx){
				zhx.initialize(step);	
			});		
		},
		/**
		 * 福彩3d直选和值选号区
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		fc3dZhxHz: function(step){
			//启动视图渲染
			require.async('./fc3d/zhxhz',function(zhxhz){
				zhxhz.initialize(step);	
			});		
		},
		/**
		 * 福彩3d直选投注
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		fc3dZhxBet: function(step){
			//启动视图渲染
			require.async('./fc3d/fc3dzhxbet',function(bet){
				bet.initialize(step);
			});		
		},
		/**
		 * 福彩3d组三选号区
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		fc3dZ3: function(step){
			//启动视图渲染
			require.async('./fc3d/z3',function(z3){
				z3.initialize(step);	
			});		
		},
		/**
		 * 福彩3d组三和值选号区
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		fc3dZ3Hz: function(step){
			//启动视图渲染
			require.async('./fc3d/z3hz',function(z3hz){
				z3hz.initialize(step);	
			});		
		},
		/**
		 * 福彩3d组三投注
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		fc3dZ3Bet: function(step){
			//启动视图渲染
			require.async('./fc3d/fc3dz3bet',function(bet){
				bet.initialize(step);
			});		
		},
		/**
		 * 福彩3d组六选号区
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		fc3dZ6: function(step){
			//启动视图渲染
			require.async('./fc3d/z6',function(z6){
				z6.initialize(step);	
			});		
		},
		/**
		 * 福彩3d组三和值选号区
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		fc3dZ6Hz: function(step){
			//启动视图渲染
			require.async('./fc3d/z6hz',function(z6hz){
				z6hz.initialize(step);	
			});		
		},
		/**
		 * 福彩3d组六投注
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		fc3dZ6Bet: function(step,child){
			//启动视图渲染
			require.async('./fc3d/fc3dz6bet',function(bet){
				bet.initialize(step);
			});		
		},
		/**
		 * 七乐彩普通选号
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		qlcCommon: function(step){
			//启动视图渲染
			require.async('./qlc/common',function(common){
				common.initialize(step);	
			});		
		},
		/**
		 * 七乐彩投注
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		qlcBet: function(step){
			//启动视图渲染
			require.async('./qlc/qlcbet',function(bet){
				bet.initialize(step);
			});		
		},
		/**
		 * 十五选五普通选号
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		swxwCommon: function(step){
			//启动视图渲染
			require.async('./swxw/common',function(common){
				common.initialize(step);	
			});		
		},
		/**
		 * 十五选五投注
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		swxwBet: function(step){
			//启动视图渲染
			require.async('./swxw/swxwbet',function(bet){
				bet.initialize(step);
			});		
		},
		
		/**
		 * 新时时彩一星直选选号
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		xsscX1zhx: function(step){
			//启动视图渲染
			require.async('./xssc/x1zhx',function(x1zhx){
				x1zhx.initialize(step);	
			});		
		}
	});
	window['appcontroller'] = new AppController;
	window.onhashchange = function(){
		if(window.cbox){
			cbox.destroy();
		}
	}
	Backbone.history.start();
});
