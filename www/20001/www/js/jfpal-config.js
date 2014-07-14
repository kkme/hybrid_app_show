define(function(require, exports, module) {
    // 不同的view，触发不同的hash
    var leftHash = '';

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

    //导航条两侧点击效果
    $('.leftButton').on('touchstart', function() {
        $(this).addClass('taped');
    });
    $('.leftButton').on('touchend', function() {
        $(this).removeClass('taped');
    });

	C.Config = $.extend(C.Config, {
	    leftBar: function(state) {
            switch (state) {
                case 'index':
                    leftHash = '';
            }
	    },

        // 根据相应页面改变导航条                
        setToolBar: function(hash, step, title) {
            if ((step == '') || hash.match('index')) {
                C.Config.leftBar('index');
                $('nav .navTitle').text('彩票');
            }
        }
	});
});