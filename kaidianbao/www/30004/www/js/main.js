// 入口模块
define('main', ['mmRequest', 'mmAnimate'], function() {
	// 全局共用的对象
	window.obj = {
		API_URL: 'http://pro.jfpal.com:80/api/',
		tinyshop_id: ''
	};

	// 将默认弹窗改为系统本地弹窗
    window.alert = navigator.notification.alert;
    window.confirm = navigator.notification.confirm;

	// 取回商品数据
	var getGoodsInfo = function() {
		avalon.ajax({
	        url: obj.API_URL + '?r=store.product.list',
	        type: 'get',
	        data: {
	            mobile_no: context.user.mobileNo
	        },
	        success: function(data) {
	            if (data.success) {
	            	var tempArr = data.product_list;
	            	tempArr.forEach(function(value, index) {
	            		value['showReEff'] = false;
	            	});
	            	goodsShow.goods = tempArr; // 将处理好的数据赋值给 goodsShow 中的监控对象 vm.goods;
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
	};

	// 服务器验证身份
	(function() {
		avalon.ajax({
            url: obj.API_URL + '?r=store.tinyshop.login',
            type: 'post',
            data: {
                mobile_no: context.user.mobileNo,
                username: context.user.realName,
                token: context.user.token
            },
            success: function(data) {
                if (data.success) {
                    obj.tinyshop_id = data.tinyshop.id; // 身份验证成功后，保存福店id到全部变量中
                    getGoodsInfo(); // 身份验证成功后，获取商品列表
                } else {
                	load.bool = false;
                    alert(data.msg, function() {}, '提示', '确定');
                }
            },
            error: function() {
                load.bool = false;
                alert('请检查当前网络', function() {}, '提示', '确定');
            }
        });
	})();

	var load = avalon.define('loading', function(vm) {
		vm.bool = false;
	});

	// 处理传到商品编辑页面的数据
	var dealGoodsInfo = function(data) {
		avalon.mix(goodsEdit.goodsInfo, data);
	};

	// 跳转到上传商品部分，初始化相关参数
	var toAddGoodsPage = function() {
		avalon(document.querySelector('#gd_show')).fadeOut(0);
		avalon(document.querySelector('#gd_add')).fadeIn(300);
	};

	// 删除商品
	var delGoods = function(index, goods) {
        avalon.ajax({
            url: obj.API_URL + '?r=store.product.delete',
            type: 'post',
            data: {
                product_id: goods[index]['id']
            },
            success: function(data) {
                if (data.success) {
                	load.bool = false;
                    alert('产品删除成功', function() {
                    	goods[index]['showReEff'] = true;
                    }, '提示', '确定');
                } else {
                	load.bool = false;
                    alert(data.msg, function() {}, '提示', '确定');
                }
            },
            error: function() {
            	load.bool = false;
                alert('请检查当前网络', function() {}, '提示', '确定');
            }
        });
	};

	// 商品管理部分
	var goodsShow = avalon.define('goodsShow', function(vm) {
		vm.showReEff = false; // 删除当前商品效果
		vm.goods = []; // 取回的商品数据

		// 点击商品，向左滑出商品编辑区域
		vm.editGoods = function(index) {
			goodsEdit.isShow = goodsEdit.isShade = true;
			dealGoodsInfo(vm.goods[index]);
		}

		// 动画执行完毕后，移除当前商品
		vm.removeFx = function(index) {
			vm.goods.splice(index, 1);
		};

		vm.removeGoods = function(e, gIndex) {
			e.stopPropagation(); // 点击删除按钮，阻止冒泡

			// 弹出选择框
			confirm('确认清空购物车', function(index) {
				if (index == 1) {
					delGoods(gIndex, vm.goods);
				}
			}, '提示', ['确定', '取消']);
		};

		// 跳转到上传商品部分
		vm.addGoods = function() {
			toAddGoodsPage();
		};
 	});

 	// 更新商品信息
 	var updateGoodsInfo = function(flag ,image, data) {
 		var imageId = (flag == 0) ? data.image : image;
 		avalon.ajax({
            url: obj.API_URL + '?r=store.product.update',
            type: 'post',
            data: {
                product_id: data.id,
                tinyshop_id: obj.tinyshop_id,
                image_id: imageId,
                name: data.name,
                price: (data.price * 1).toFixed(2),
                information: data.information
            },
            success: function(data) {
                if (data.success) {
                    load.bool = false;
                    alert('保存成功', function() {
                    	goodsEdit.isShow = goodsEdit.isShade = false; // 隐藏商品编辑区域
	                    getGoodsInfo(); // 更新商品管理区域商品信息
                    }, '提示', '确定');
                } else {
                	load.bool = false;
                    alert(data.msg, function() {}, '提示', '确定');
                }
            },
            error: function() {
            	load.bool = false;
                alert('请检查当前网络', function() {}, '提示', '确定');
            }
        });
 	};

 	//新增商品信息
 	var createGoodsInfo = function(data) {
 		avalon.ajax({
	        url: obj.API_URL + '?r=store.product.create',
	        type: 'post',
	        data: {
	            mobile_no: context.user.mobileNo,
	            image_id: data.image,
	            name: data.name,
	            price: (data.price * 1).toFixed(2),
	            information: data.info
	        },
	        success: function(data) {
	            if (data.success) {
	                load.bool = false;
                    alert('产品添加成功', function() {
                    	getGoodsInfo(); // 更新商品管理区域商品信息
                    	
                    	// 跳转到商品管理部分
						avalon(document.querySelector('#gd_add')).fadeOut(0);
						avalon(document.querySelector('#gd_show')).fadeIn(300);
                    }, '提示', '确定');
	            } else {
	            	load.bool = false;
                    alert('data.msg', function() {}, '提示', '确定');
	            }
	        },
	        error: function() {
	        	load.bool = false;
                alert('请检查当前网络', function() {}, '提示', '确定');
	        }
	    });
 	};

 	// 上传商品图片
 	var uploadPic = function(flag, data) {
 		var imageSrc = (flag == 'add') ? data.image_src : data.image;

 		var ft = new FileTransfer();
        var options = new FileUploadOptions();
        options.fileKey = "image";
        options.params = {
            tinyshop_id: obj.tinyshop_id
        };
        ft.upload(imageSrc, encodeURI(obj.API_URL + "?r=store.product.imagecreate"), function(data) {
            var resp = JSON.parse(data.response);
            if (resp.success) {
            	if (flag == 'add') {
            		createGoodsInfo(resp);
            	} else {
            		updateGoodsInfo(1, resp.image, data);
            	}
            } else {
                load.bool = false;
                alert('data.msg', function() {}, '提示', '确定');
            }
        }, function(error) {
            load.bool = false;
            alert('图片上传失败', function() {}, '提示', '确定');
        }, options);
 	};

	// 判断是否需要先上传图片
 	var isUploadPic = function(data) {
 		if (data.image == 'uploadPic') {
 			uploadPic('update', data);
 		} else {
 			updateGoodsInfo(0, data.image, data);
 		}
 	};

 	// 如何获取图片
 	var getPic = function(flag, state) {
 		var tw,
 			th;
 		tw = th = (state == 'add') ? 200 : 186;
 		var sourceType = (flag == 0) ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
 		navigator.camera.getPicture(function(data) {
 			if (state == 'add') {
 				addGoods.goodsInfo.image_src = data;
 			} else {
 				goodsEdit.goodsInfo.image_src = data;
 				goodsEdit.goodsInfo.image = 'uploadPic';
 			}
        }, function(error) {
            alert(error, function() {}, '提示', '确定');
        }, {
            quality: 50,
            targetWidth: tw,
            targetHeight: th,
            sourceType: sourceType,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true
        });
 	};

 	// 上传前验证输入框
 	var verifyUploadData = function(flag, data) {
 		// 添加商品,判断图片是否添加
 		if (flag == 'add') {
 			if (data.image_src == '../images/camera.png') {
 				alert('商品图片不能为空', function() {}, '提示', '确定');
 				return 0;
 			}
 		}

 		if (data.name == '') {
 			alert('商品名称不能为空', function() {}, '提示', '确定');
 			return 0;
 		}
 		if (data.price == '') {
 			alert('请检查商品价格', function() {}, '提示', '确定');
 			return 0;
 		}
 		if (data.information == '') {
 			alert('商品描述不能为空', function() {}, '提示', '确定');
 			return 0;
 		}
 		return 1;
 	};

 	// 商品编辑部分
 	var goodsEdit = avalon.define('goodsEdit', function(vm) {
 		// 商品管理页传过来的渲染数据
 		vm.goodsInfo = {
 			id: '',
 			image_src: '',
 			name: '',
 			price: '',
 			information: ''
 		};

 		vm.isShow = false; // 是否向左滑动
 		vm.isShade = false; // 是否启动左侧阴影

 		// 单击阴影部分，隐藏商品编辑部分
 		vm.hideGd = function() {
 			vm.isShow = vm.isShade = false;
 		};

 		// 显示获取商品图片选项
 		vm.getGoodsPic = function() {
 			vm.getPic = true;
 		};

 		// 更新商品信息
 		vm.submit = function() {
 			if (verifyUploadData('update', vm.goodsInfo) == 1) {
 				load.bool = true;
 				isUploadPic(vm.goodsInfo);
 			}
 		};

 		vm.getPic = false; // 是否显示获取商品图片选项

 		// 拍照获取图片
 		vm.openCamera = function() {
 			vm.getPic = false;
 			getPic(0, 'update');
 		};

 		// 打开图库获取图片
 		vm.openGallery = function() {
 			vm.getPic = false;
 			getPic(1, 'update');
 		};

 		// 隐藏获取商品图片选项
 		vm.hideGetPic = function() {
 			vm.getPic = false;
 		};
 	});

 	// addGoods.goodsInfo 初始化对象
 	var gdInit = {
		image_src: '../images/camera.png', // 商品图片
 		name: '', // 商品名称
 		price: '', // 商品价格
 		info: '' // 商品描述
	};

	// 重置 addGoods.goodsInfo
	var initGoodsInfo = function() {
		avalon.mix(addGoods.goodsInfo, gdInit);
	};

 	// 跳转到商品管理部分,初始化相关状态
	var toGoodsShowPage = function() {
		// 跳转到商品管理部分
		avalon(document.querySelector('#gd_add')).fadeOut(0);
		avalon(document.querySelector('#gd_show')).fadeIn(300);

		// 初始化相关状态
		document.querySelector('.up_area > ul').style.display = 'none';
		initGoodsInfo();
	};

 	// 商品上传部分
 	var addGoods = avalon.define('addGoods', function(vm) {
 		vm.goodsInfo = {
 			image_src: '../images/camera.png', // 商品图片
	 		name: '', // 商品名称
	 		price: '', // 商品价格
	 		info: '' // 商品描述
 		};

 		// 显示获取商品图片选项
 		vm.getGoodsPic = function() {
 			avalon(document.querySelector('.up_area ul')).fadeIn(300);
 		};

 		// 拍照获取图片
 		vm.openCamera = function() {
 			avalon(this.parentNode).fadeOut(300, {
 				after: function() {
 					getPic(0, 'add');
 				}
 			});
 		};

 		// 打开图库获取图片
 		vm.openGallery = function() {
 			avalon(this.parentNode).fadeOut(300, {
 				after: function() {
 					getPic(1, 'add');
 				}
 			});
 		};

 		// 隐藏获取商品图片选项
 		vm.hideGetPic = function() {
 			avalon(this.parentNode).fadeOut(300);
 		};

 		// 跳转到商品管理部分
 		vm.goodsEdit = function() {
 			toGoodsShowPage();
 		};

 		// 创建新的商品
 		vm.addNewGoods = function() {
 			if (verifyUploadData('add', vm.goodsInfo) == 1) {
 				load.bool = true;
 				uploadPic('add', vm.goodsInfo);
 			}
 		};
 	});

	avalon.scan();
});