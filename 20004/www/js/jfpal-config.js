define(function(require, exports, module) {
    // 不同的view，触发不同的hash
    var leftHash = '';
    var rightHash = '';

    function goBack() {
        if (leftHash != '') {
            location.hash = leftHash;
            if (leftHash = '!index/4') {
                $('#city .list').hide();
            }
        } else {
            context.quit();
        }
        $('#loading').fadeOut(200); // 点击返回，隐藏网络请求等待层
    }

    //左侧返回按钮点击事件
    if (device.platform == 'iOS') {
        $('nav .leftButton').on('click', goBack);
    } else if (device.platform == 'Android') {
        document.addEventListener('backbutton', goBack, false);
    }

    //右侧按钮点击事件
    $('nav .rightButton').on('click', function() {
        location.hash = rightHash;
    });

    //导航条两侧点击效果
    $('.leftButton, .rightButton').on('touchstart', function() {
        $(this).addClass('taped');
    });
    $('.leftButton, .rightButton').on('touchend', function() {
        $(this).removeClass('taped');
    });

	C.Config = $.extend(C.Config, {
	    leftBar: function(state) {
            switch (state) {
                case 'index':
                    leftHash = '';
                    break;
                case 'tip':
                    leftHash = '!index/4';
                    break;
                case 'city':
                    leftHash = '!index/1';
                    break;
                case 'myOrder':
                    leftHash = '!index/5';
                    break;
                case 'queryTicket':
                    leftHash = '!index/6';
                    break;
                case 'writeOrder':
                    leftHash = '!queryTicket/2';
                    break;
                case 'addPassenger':
                    leftHash = '!writeOrder/2';
                    break;
                case 'new_pas':
                    leftHash = '!addPassenger/2';
            }
	    },

	    rightBar: function(state) {
            switch (state) {
                case 'index':
                    rightHash = '!myOrder/1';
                    $('nav .rightButton').css('visibility', 'visible').text('订单');
                    break;
                case 'tip':
                    $('nav .rightButton').css('visibility', 'hidden');
                    break;
                case 'city':
                    $('nav .rightButton').css('visibility', 'hidden');
                    break;
                case 'myOrder':
                    $('nav .rightButton').css('visibility', 'hidden');
                    break;
                case 'queryTicket':
                    $('nav .rightButton').css('visibility', 'hidden');
                    break;
                case 'writeOrder':
                    $('nav .rightButton').css('visibility', 'hidden');
                    break;
                case 'addPassenger':
                    rightHash = '!new_pas/1';
                    $('nav .rightButton').css('visibility', 'visible').text('新增');
                    break;
                case 'new_pas':
                    $('nav .rightButton').css('visibility', 'hidden');
            }
	    },

        // 根据相应页面改变导航条                
        setToolBar: function(hash, step, title) {
            if ((step == '') || hash.match('index')) {
                C.Config.leftBar('index');
                $('nav .navTitle').text('火车票');
                C.Config.rightBar('index');
            } else if (hash.match('tip')) {
                C.Config.leftBar('tip');
                $('nav .navTitle').text('购票须知');
                C.Config.rightBar('tip');
            } else if (hash.match('city')) {
                C.Config.leftBar('city');
                $('nav .navTitle').text('车站列表');
                C.Config.rightBar('city');
            } else if (hash.match('queryTicket')) {
                C.Config.leftBar('queryTicket');
                $('nav .navTitle').text('车票信息');
                C.Config.rightBar('queryTicket');
            } else if (hash.match('myOrder')) {
                C.Config.leftBar('myOrder');
                $('nav .navTitle').text('我的订单');
                C.Config.rightBar('myOrder');
            } else if (hash.match('writeOrder')) {
                C.Config.leftBar('writeOrder');
                $('nav .navTitle').text('车票预订');
                C.Config.rightBar('writeOrder');
            } else if (hash.match('addPassenger')) {
                C.Config.leftBar('addPassenger');
                $('nav .navTitle').text('乘客列表');
                C.Config.rightBar('addPassenger');
            } else if (hash.match('new_pas')) {
                var title = (step == '1') ? '新增乘客': '修改乘客信息';
                C.Config.leftBar('new_pas');
                $('nav .navTitle').text(title);
                C.Config.rightBar('new_pas');
            }
        }
	});
});