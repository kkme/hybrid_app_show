//导航模块定义
define(function(require, exports) {
       
    return {
    	init: function(step) {
            var hash = location.hash;
            
            C.Config.setToolBar(hash, step);

            if (hash.match('myWeidian')) {
                if (step != '1') {
                    $('#steps').children().fadeOut(0, function() {
                        $('#steps #myWeidian').fadeIn(300);
                    });
                }
            } else if (hash.match('shopEidt')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #shopEidt').fadeIn(300);
                });
            } else if (hash.match('pubGoods')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #pubGoods').fadeIn(300);
                });
            } else if (hash.match('pub_goods_details')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #pub_goods_details').fadeIn(300);
                });
            } else if (hash.match('goods_sort')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #goods_sort').fadeIn(300);
                });
            } else if (hash.match('goods_library')) {
                $('#steps').children().fadeOut(0, function() {
                    $('#steps #goods_library').fadeIn(300);
                });
            }
        }
    };
});