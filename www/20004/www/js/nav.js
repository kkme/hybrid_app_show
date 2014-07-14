//导航模块定义
define(function(require, exports) {
    // 计算是否是第一次进入首页  
    var isFirst = 1;
       
    return {
    	init: function(step, title) {
            var hash = location.hash;

            C.Config.setToolBar(hash, step, title);
       
    		if ((step == '') || hash.match('index')) {
                if (isFirst != 1) {
                    $('#steps').children().fadeOut(0, function() {
                        $('#steps #step1').fadeIn(200);
                    });
                }
                isFirst += 1;
    		} else if (hash.match('tip')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #tip').fadeIn(200);
                });
            } else if (hash.match('city')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #city').fadeIn(200);
                });
            } else if (hash.match('queryTicket')) {       
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #queryTicket').fadeIn(200);
                });
            } else if (hash.match('myOrder')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #myOrder').fadeIn(200);
                });
            } else if (hash.match('writeOrder')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #writeOrder').fadeIn(200);
                });
            } else if (hash.match('addPassenger')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #addPassenger').fadeIn(200);
                });
            } else if (hash.match('new_pas')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #new_pas').fadeIn(200);
                });
            }
        }
    };
});