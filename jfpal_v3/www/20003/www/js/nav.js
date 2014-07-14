//导航模块定义
define(function(require, exports) {
    // 计算是否是第一次进入首页  
    var isFirst = 1;
       
    return {
    	init: function(step, title) {
            var hash = location.hash;

            C.Config.setToolBar(hash, step, title);

            if ((step == '') || hash.match('findWeidian')) {
                if (isFirst != 1) {
                    $('#steps').children().fadeOut(0, function() {
                        $('#steps #findWeidian').fadeIn(300);
                    });
                }
                isFirst += 1;
            } else if (hash.match('enterWeidian')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #enterWeidian').fadeIn(300);
                });
            } else if (hash.match('settlement')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #settlement').fadeIn(300);
                });
            }
        }
    };
});