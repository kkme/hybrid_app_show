// 顶部导航条模块
define(function() {
	var nav = avalon.define('nav', function(vm) {
		vm.title = ''; // 中间标题
		vm.isVisible = 'hidden'; // 是否显示右侧按钮
		vm.$backEvent = function() {}; // 导航条返回事件
		vm.$editEvent = function() {} // 导航条右侧编辑事件

		// 返回事件
		vm.back = function() {
			vm.$backEvent();
		};
		
		// 右侧编辑事件
		vm.edit = function() {
			vm.$editEvent();
		};
	});
	
	// 导航条相关设置
	var	setToolBar = {
		'/index': function() {
			nav.title = '帮助';
			nav.isVisible = 'hidden';
			nav.$backEvent = function() {
				context.quit();
			};
		},
		'/surPho': function() {
			nav.title = '支持手机型号列表';
			nav.isVisible = 'hidden';
			nav.$backEvent = function() {
				avalon.router.navigate('!/index/2');
			};
		},
		'/phoSet': function(step, title) {
			nav.title = title;
			nav.isVisible = 'hidden';
			nav.$backEvent = function() {
				if (winObj.hackFlag != 1) {
					avalon.router.navigate('!/index/3');
				} else {
					document.location = 'http://finishwebview';
				}
			};
		},
		'/helpDec': function(step) {
			nav.title = '帮助说明';
			nav.isVisible = 'visible';
			nav.$backEvent = function() {
				if (winObj.hackFlag != 1) {
					if (step != '3') {
						avalon.router.navigate('!/phoSet/2');
					} else {
						avalon.router.navigate('!/index/4');
					}
				} else {
					if (step == '4') {
						document.location = 'http://finishwebview';
					} else {
						avalon.router.navigate('!/phoSet/2');
					}
				}
			};
			nav.$editEvent = function() {
				avalon.router.navigate('!/feedback/1');
			};
		},
		'/feedback': function() {
			nav.title = '反馈';
			nav.isVisible = 'hidden';
			nav.$backEvent = function() {
				avalon.router.navigate('!/helpDec/2');
				// 隐藏软键盘
				document.querySelector('textarea').blur();
			};
		}
	};

	avalon.scan();

	// 暴露接口，外部调用
	return {
		init: function(flag, step, title) {
			setToolBar[flag](step, title);
		}
	};
});