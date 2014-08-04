define(['mmRouter'], function() {
	window.winObj = {
		brand: [{brand: 'iPhone手机系列', id: 1}, {brand: '小米手机系列', id: 2}, {brand: '三星新款手机系列', id: 3}, {brand: '酷派手机系列', id: 5}, {brand: '华为手机系列', id: 6}, {brand: '其他手机', id: 7}],
		surPho: [{brand: 'iphone4'}, {brand: 'iphone4s'}, {brand: 'iphone5'}, {brand: 'iphone5s'}, {brand: '三星Note1'}, {brand: '三星Note2'}, {brand: '三星Note3'}], // 后台返回的支持手机型号列表
		id: '', // 用户选择何种系列手机标志位
		// 模拟后台接口数据结构
		phoSet: {
			'1': {
				name: 'iPhone手机系列',
				setStep: {
					'1': {
						'name': '麦克风权限设置步骤',
						'step': [['1.在桌面打开"设置"程序', ['../images/phoSetImg/iPhone1.png']], ['2.在设置中选择"隐私"', ['../images/phoSetImg/iPhone2.png']], ['3.在隐私中选择"麦克风"', ['../images/phoSetImg/iPhone3.png']], ['4.在麦克风中找到"即付宝"打开开关', ['../images/phoSetImg/iPhone4.png']]]
					},
					'2': {
						'name': '声道设置步骤',
						'step': [['1.在桌面打开"设置"程序', ['../images/phoSetImg/iPhone1.png']], ['2.在设置中选择"通用"', ['../images/phoSetImg/iPhone6.png']], ['3.在隐私中选择"辅助功能"', ['../images/phoSetImg/iPhone5.png']], ['4.设置"单声道音频"为关闭状态', ['../images/phoSetImg/iPhone8.png']]]
					},
					'3': {
						'name': '音量限制设置步骤',
						'step': [['1.在桌面打开"设置"程序', ['../images/phoSetImg/iPhone1.png']], ['2.在设置中选择"音乐"', ['../images/phoSetImg/iPhone10.png']], ['3.均衡器选择关闭,再选择"音量限制"', ['../images/phoSetImg/iPhone11.png']], ['4.拉大最大那边（最右边）就关闭了。', ['../images/phoSetImg/iPhone12.png']]]
					}
				}
			},
			'2': {
				name: '小米系列',
				setStep: {
					'1': {
						'name': '小米2系列设置步骤',
						'step': [['1.在手机设置中选择音效与振动', ['../images/phoSetImg/xiaomi1.png']], ['2.选择米音', ['../images/phoSetImg/xiaomi2.png']], ['3.选择关闭,插上手机刷卡器试下', ['../images/phoSetImg/xiaomi3.png']], ['4.将手机重新启动', []], ['5.将客户端卸载重装', []]]
					},
					'2': {
						'name': '小米3系列设置步骤',
						'step': [['1.在手机设置中选择音效与振动', ['../images/phoSetImg/xiaomi1.png']], ['2.选择米音', ['../images/phoSetImg/xiaomi5.png']], ['3.选择关闭,插上手机刷卡器重试', ['../images/phoSetImg/xiaomi3.png']], ['4.将手机重新启动', []], ['5.将客户端卸载重装', []]]
					}
				}
			},
			'3': {
				name: '三星新手机系列',
				setStep: {
					'1': {
						'name': '',
						'step': [['1.进入手机设置选择"声音"', ['../images/phoSetImg/samsung1.png']], ['2.选择音频输出', ['../images/phoSetImg/samsung2.png']], ['3.选择立体声', ['../images/phoSetImg/samsung3.png']]]
					}
				}
			},
			'5': {
				name: '酷派手机系列',
				setStep: {
					'1': {
						'name': '',
						'step': [['1.请检查手机设置-声音-音效设置-关闭', ['../images/phoSetImg/coolpad1.png']], ['2.播放器-设置-关闭DTS音效或杜比音效（以系统版本不同区分）', ['../images/phoSetImg/coolpad2.png', '../images/phoSetImg/coolpad3.png']]]
					}
				}
			},
			'6': {
				name: '华为手机系列',
				setStep: {
					'1': {
						'name': '华为x1设置步骤',
						'step': [['1.首先打开设置，选择声音', ['../images/phoSetImg/huawei1.png']], ['2.在声音设置中需关闭"DTS模式"', ['../images/phoSetImg/huawei2.png']]]
					},
					'2': {
						'name': '华为P6设置步骤',
						'step': [['1.首先打开设置，选择声音', ['../images/phoSetImg/huawei3.png']], ['2.在声音中选择杜比数字', ['../images/phoSetImg/huawei4.png']], ['3.关闭杜比数字', ['../images/phoSetImg/huawei5.png']]]
					}
				}
			}
 		},

 		hackFlag: 0 // mmRouter 模块 hack 标志位
	};

	// 首页路由
	avalon.router.get('', function() {});

	// 首页路由
	avalon.router.get('!/index/:step', function(step) {
		if (step == '1') {
		    // 进入首页的特殊处理
			require('../models/indexModel', function(indexModel) {
				indexModel.init(step);
			});
		} else if (step == '2' || '3' || '4') {
			// 从支持手机型号列表页返回，就显示
			require('../modules/index', function(index) {
				index.init(step);
			});
		};
	});

	// 支持手机型号列表页路由
	avalon.router.get('!/surPho/:step', function(step) {
		require('../models/surPhoModel', function(surPhoModel) {
			surPhoModel.init(step);
		});
	});

	// 手机设置页路由
	avalon.router.get('!/phoSet/:step', function(step) {
		require('../models/phoSetModel', function(phoSetModel) {
			phoSetModel.init(step);
		});
	});

	// 帮助说明页路由
	avalon.router.get('!/helpDec/:step', function(step) {
		require('../modules/helpDec', function(helpDec) {
			helpDec.init(step);
		});
	});

	// 反馈页路由
	avalon.router.get('!/feedback/:step', function(step) {
		require('../modules/feedback', function(feedback) {
			feedback.init(step);
		});
	});

	avalon.history.start();

	// mmRoute 模块尚未完善的 hack，有点坑爹
	if (location.hash == '') {
		winObj.hackFlag = 0;
		avalon.router.navigate('!/index/1');
	} else {
		winObj.hackFlag = 1;
		var sign = location.hash.split('/');
		var flag = 0;
		switch (sign[sign.length-1]) {
			case 'iphone':
				winObj.id = '1';
				break;
			case 'xiaomi':
				winObj.id = '2';
				break;
			case 'samsung':
				winObj.id = '3';
				break;
			case 'coolpad':
				winObj.id = '5';
				break;
			case 'huawei':
				winObj.id = '6';
				break;
			case 'other':
				winObj.id = '7';
				flag = 1;
				avalon.router.navigate('!/helpDec/4');
				break;
		}
		if (flag == 0) {
			avalon.router.navigate('!/phoSet/1');
		}
	}

	avalon.scan();
});