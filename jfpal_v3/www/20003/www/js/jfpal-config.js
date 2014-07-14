define(function(require, exports, module) {
    var leftHash = '';
    var rightTap = 0;

    goBack = function() {
        if ($('#trolley_layer').css('display') == 'block') {
            return;
        }
        if (leftHash != '') {
            location.hash = leftHash;
        } else {
            context.quit();
        }
    }

    if (device.platform == 'iOS') {
        $('nav .leftButton').on('click', goBack);
    } else if (device.platform == 'Android') {
        document.addEventListener('backbutton', goBack, false);
    }

    //导航条左侧点击效果
    $('.leftButton').on('touchstart', function() {
        $(this).addClass('taped');
    });
    $('.leftButton').on('touchend', function() {
        $(this).removeClass('taped');
    });

    //导航条右侧点击效果
    $('.rightButton').on('touchstart', function() {
        if (rightTap == 0) {
            $(this).addClass('taped');
        } else {
            $(this).addClass('taped1');
        }
    });
    $('.rightButton').on('touchend', function() {
        if (rightTap == 0) {
            $(this).removeClass('taped');
        } else {
            $(this).removeClass('taped1');
        }
    });

	C.Config = $.extend(C.Config, {
	    leftBar: function(state) {
	    	switch (state) {
                case 'findWeidian':
                    leftHash = '';
                    break;
                case 'enterWeidian':
                    leftHash = '!findWeidian/1';
                    break;
                case 'settlement':
                    leftHash = '!enterWeidian/2';
            }
	    },

	    rightBar: function(state) {
	    	switch (state) {
                case 'findWeidian':

                    rightTap = 0;
                    // $('nav .rightButton').removeClass('cleanColor').text('历史');
                    break;
                case 'enterWeidian':
                    
                    rightTap = 1;
                    // $('nav .rightButton').addClass('cleanColor').text('');
                    break;
                case 'settlement':
                    // $('nav .rightButton').removeClass('cleanColor');
            }
	    },
                        
        setToolBar: function(hash, step, title) {
            if ((step == '') || hash.match('findWeidian')) {
                C.Config.leftBar('findWeidian');
                $('nav .navTitle').text('访问福店');
                C.Config.rightBar('findWeidian');
            } else if (hash.match('enterWeidian')) {
                C.Config.leftBar('enterWeidian');
                $('nav .navTitle').text(title);
                C.Config.rightBar('enterWeidian');
            } else if (hash.match('settlement')) {
                C.Config.leftBar('settlement');
                $('nav .navTitle').text('购物车结算');
                C.Config.rightBar('settlement');
            }
        }
	});
});