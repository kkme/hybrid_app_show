define(function(require, exports, module) {
    var leftHash = '';
    var rightHash = '';

    function goBack() {
        if (leftHash != '') {
            location.hash = leftHash;
        } else {
            context.quit();
        }
        $('#loading').fadeOut(200);
    }

    if (device.platform == 'iOS') {
        $('nav .leftButton').on('click', goBack);
    } else if (device.platform == 'Android') {
        document.addEventListener('backbutton', goBack, false);
    }

    $('nav .rightButton').on('click', function() {
        location.hash = rightHash;
    });

    //导航条左侧点击效果
    $('.leftButton').on('touchstart', function() {
        $(this).addClass('taped');
    });
    $('.leftButton').on('touchend', function() {
        $(this).removeClass('taped');
    });

    //导航条右侧点击效果
    $('.rightButton').on('touchstart', function() {
        $(this).addClass('taped');
    });
    $('.rightButton').on('touchend', function() {
        $(this).removeClass('taped');
    }); 

	C.Config = $.extend(C.Config, {
	    leftBar: function(state) {
	    	switch (state) {
                case 'myWeidian':
                    leftHash = '';
                    break;
                case 'shopEidt':
                    leftHash = '!myWeidian/3';
                    $('nav .rightButton').removeClass('addColor').text('');
                    break;
                case 'pubGoods':
                    leftHash = '!myWeidian/2';
                    break;
                case 'pub_goods_details':
                    leftHash = '!pubGoods/2';
                    break;
                case 'goods_sort':
                    leftHash = '!pub_goods_details/1';
                    break;
                case 'goods_library':
                    leftHash = '!goods_sort/2';
            }
	    },

	    rightBar: function(state) {
	    	switch (state) {
                case 'myWeidian':
                    rightHash = '!pubGoods/1';
                    $('nav .rightButton').addClass('addColor').text('管理');
                    break;
                case 'pubGoods':
                    $('nav .rightButton').removeClass('addColor').text('');
            }
	    },
                        
        setToolBar: function(hash, step) {
            if (hash.match('myWeidian')) {
                C.Config.leftBar('myWeidian');
                $('nav .navTitle').text('我的福店');
                C.Config.rightBar('myWeidian');
            } else if (hash.match('shopEidt')) {
                C.Config.leftBar('shopEidt');
                $('nav .navTitle').text('店铺编辑');
                C.Config.rightBar('shopEidt');
            } else if (hash.match('pubGoods')) {
                C.Config.leftBar('pubGoods');
                C.Config.rightBar('pubGoods');
            } else if (hash.match('pub_goods_details')) {
                C.Config.leftBar('pub_goods_details');
                C.Config.rightBar('pub_goods_details');
                var titleText = (step == '1' || step == '2') ? '添加商品' : '编辑商品';
                $('nav .navTitle').text(titleText);
            } else if (hash.match('goods_sort')) {
                C.Config.leftBar('goods_sort');
                $('nav .navTitle').text('商品库分类');
                C.Config.rightBar('goods_sort');
            } else if (hash.match('goods_library')) {
                C.Config.leftBar('goods_library');
                $('nav .navTitle').text('商品库');
                C.Config.rightBar('goods_library');
            }
        }
	});
});