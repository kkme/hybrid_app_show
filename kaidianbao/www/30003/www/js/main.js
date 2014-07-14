// 入口模块
define('main', ['mmRequest'],function() {
	(function() {
		// 全局共用的对象
		window.obj = {
			API_URL: 'http://pro.jfpal.com:80/api/',
		};

		// 取回商品数据
		avalon.ajax({
	        url: obj.API_URL + '?r=store.product.list',
	        type: 'get',
	        data: {
	            mobile_no: context.user.mobileNo
	        },
	        success: function(data) {
	            if (data.success) {
	            	var tempObj = {};
	            	data.product_list.forEach(function(value, index) {
	            		tempObj[value.id] = value;
	            		tempObj[value.id]['quantity'] = 1;
	            		tempObj[value.id]['isEmpty'] = false;
	            	});
	            	model.goodsObj = tempObj; // 将处理好的数据赋值给 model 中的监控对象 vm.goodsObj;
	            	load.bool = false; // 数据取回成功后，隐藏loading层
	            } else {
	            	load.bool = false; // 数据取回失败后，隐藏loading层
	                alert('请检查网络设置', function() {}, '提示', '确定');
	            }
	        },
	        error: function() {
	        	load.bool = false; // 数据取回失败后，隐藏loading层
	            alert('请检查网络设置', function() {}, '提示', '确定');
	        }
	    });

	    // 将默认弹窗改为系统本地弹窗
	    window.alert = navigator.notification.alert;
        window.confirm = navigator.notification.confirm;

	    // 获取费率描述
	    context.helpinfo('PersonalPayments.PayWayCommon', function(data){
            model.$payWayCommon = data;
        });
        context.helpinfo('PersonalPayments.PayWaySuper', function(data){
            model.$payWaySuper = data;
        });
	})();

	var load = avalon.define('loading', function(vm) {
		vm.bool = true;
	});

	var model = avalon.define('container', function(vm) {
		vm.goodsObj = {};
		vm.isAdded = false; // 购物车被加入商品后的效果
		vm.$syncFlag = []; // 购物车是否有该商品以及该商品数量标志位
		vm.$payWayCommon; // 零购描述
        vm.$payWaySuper; // 批发描述
		// 重置 vm.goodsObj 元素
		vm.$resetGoodsObj = function(key) {
			vm.goodsObj[key]['quantity'] = 1;
			vm.goodsObj[key]['isEmpty'] = false;
		};

		// 加入购物车
		vm.addToCart = function(key) {
			vm.isAdded = true;
			var hasEle = 0; // 是否是新种类商品标志位
			vm.$syncFlag.forEach(function(value, skey) {
				if (value[0] == key) {
					value[1] += 1;
					hasEle = 1;
					vm.goods[skey]['quantity'] = vm.goods[skey]['quantity'] * 1 + 1;
					vm.$t_price(vm.goods);
					return false;
				}
			});
			if (hasEle == 0) {
				vm.$syncFlag.unshift([key, 1]);
				vm.$resetGoodsObj(key);
				vm.goods.unshift(vm.goodsObj[key]);
				vm.$t_price(vm.goods);
			}
		};
		// 加入购物车动画结束后的回调
		vm.removeAdded = function() {
			vm.isAdded = false;
		};

		vm.isSlideLeft =  false; // 右侧购物车左滑效果标志位

		// 购物车左右滑动效果
		vm.slideEffect = function() {
			vm.isSlideLeft = !vm.isSlideLeft;
		};

		vm.goods = []; // 购物车商品种类
		vm.$flag = 0; // data-duplex-changed hack方法标志位.
		vm.$reg = /^[0-9]+$/;
		vm.$reg1 = /^[0-9]+\.[0-9]{2}$/;

		// 计算购物车总价
		vm.$t_price = function(goodsInfo) {
			var tempPrice = 0;
			goodsInfo.forEach(function(value, index) {
				tempPrice = ((tempPrice * 1) + (value.price * 1) * (value.quantity * 1)).toFixed(2);
			});
			vm.total_price = tempPrice;
		};

		// 数量框只能为数字
		vm.isNumber = function(value) {
			vm.$flag += 1;
			if (vm.$flag > vm.goods.length) {
				if (value == '') {
					return;
				}
				if (value == 0) {
					var index = this.getAttribute('data-id');
					vm.goods[index]['isEmpty'] = true;
					return;
				}
				if (!vm.$reg.test(value)) {
					var index = this.getAttribute('data-id');
					vm.$syncFlag[index]['quantity'] = vm.goods[index]['quantity'] = 1; // 格式不对,置为1
					vm.$t_price(vm.goods);
					return;
				}
				if (value*1 > 999) {
					var index = this.getAttribute('data-id');
					this.value = this.value.slice(0, 3); // 如果超过3位数，截取前三位数
					vm.$syncFlag[index]['quantity'] = vm.goods[index]['quantity'] = this.value*1;
					vm.$t_price(vm.goods);
					alert('单种商品数量最多999件', function() {}, '提示', '确定');
					return;
				}
				vm.$t_price(vm.goods);
			}
		};

		vm.isEmpty = []; // 清空购物车标志位
		// 点击垃圾桶，清空购物车
		vm.clearCart = function() {
			confirm('确认清空购物车', function(index) {
				if (index == 1) {
					vm.goods.forEach(function(value, key) {
						value.isEmpty = true;
					});
				}
			}, '提示', ['确定', '取消']);
		};

		// 商品数量增加,最多999个
		vm.addCount = function(index) {
			vm.goods[index]['quantity'] *= 1; // 修正 ms-duplex 错误，重新置为 number 类型
			var temp = vm.goods[index]['quantity'];
			vm.goods[index]['quantity'] += 1;
		};

		// 当商品数量减到0时，产生清除效果
		vm.reduceCount = function(index) {
			vm.goods[index]['quantity'] *= 1; // 修正 ms-duplex 错误，重新置为 number 类型
			vm.goods[index]['quantity'] -= 1;
		};

		// 商品数量为0，动画执行完毕后，移除当前商品，计算总价
		vm.removeFx = function(index) {
			vm.$syncFlag.splice(index, 1);
			vm.goods.splice(index, 1);
			vm.$t_price(vm.goods);
		};

		vm.total_price = 0; // 购物车商品总价

		vm.isShow = false; // 是否显示选择费率面板
		// 点击费率面板以外的区域，隐藏费率面板层
		vm.hidePanel = function(e) {
			if (e.target.classList.contains('ch_fee')) {
				vm.isShow = false;
			}
		};

		vm.$pId = '0000000002'; // 初始费率

		// 费率选中状态
		vm.isLgTaped = true;
		vm.isPfTaped = false;

		vm.feeInfo = ''; // 费率描述
		// 选择费率
		vm.chFee = function() {
			if (this.classList.contains('lg')) {
				vm.$pId = '0000000002';
				vm.isLgTaped = true;
				vm.isPfTaped = false;
				vm.feeInfo = vm.$payWayCommon;
			} else {
				vm.$pId = '0000000000';
				vm.isLgTaped = false;
				vm.isPfTaped = true;
				vm.feeInfo = vm.$payWaySuper;
			}
		};

		// 结账
		vm.$detail; // 发送到后台商品详情数据
		vm.$requestOrder = function(data) {
			jfpal.jfPay({
                "needHandsign": '1',
                "merchantId": "0002000002",
                "merchantName": '开店宝',
                "productId": vm.$pId, //0000000001
                "orderAmt": data.amount * 100 + '',
                "orderDesc": context.user.mobileNo, //微店主手机号
                "orderRemark": '1' + "#" + data.id //flagship_id#order_id
            });
		};
		vm.$ajaxInfo = function(data) {
			avalon.ajax({
		        url: obj.API_URL + '?r=store.order.submit',
		        type: 'post',
		        data: {
		            mobile_no: context.user.mobileNo,
                    payer_id: context.user.mobileNo,
                    detail: data,
                    amount: vm.total_price
		        },
		        success: function(data) {
		        	if (data.success) {
		        	    load.bool = false; // 数据取回成功后，隐藏loading层
		            	vm.$requestOrder(data.order);
		            } else {
		            	load.bool = false; // 数据取回失败后，隐藏loading层
		                alert('请检查网络设置', function() {}, '提示', '确定');
		            }
		        },
		        error: function() {
		        	load.bool = false; // 数据取回失败后，隐藏loading层
		            alert('请检查网络设置', function() {}, '提示', '确定');
		        }
		    });
		};
		vm.$dealInfo = function(goods) {
			vm.$detail = avalon.range(0, goods.length).map(function(value, index) {
				value = [];
				value[0] = goods[index]['id'];
				value[1] = goods[index]['price'];
				value[2] = goods[index]['quantity'];
				return value;
			});
			vm.$ajaxInfo(JSON.stringify(vm.$detail));
		};

		// 单击下一步验证数据
		vm.set_acc = function() {
			var flag = 0; // 是否提交数据标志位
			vm.goods.forEach(function(value, index) {
				if (!vm.$reg.test(value.quantity) || value.quantity == '') {
					flag = 1;
					alert('商品数量格式不对，请检查', function() {}, '提示', '确定');
					return;
				}
			});
			if (!vm.$reg1.test(vm.total_price)) {
				alert('商品总价格式不对，请检查', function() {}, '提示', '确定');
				return;
			}
			if (vm.total_price*1 > 10000000) {
				alert('商品总价不能大于一千万', function() {}, '提示', '确定');
				return;
			}
			if (flag == 0) {
				vm.isShow = true;
			}
		};

		//提交订单
		vm.submit = function() {
			vm.$dealInfo(vm.goods);
		};
 	});

	avalon.scan();
});