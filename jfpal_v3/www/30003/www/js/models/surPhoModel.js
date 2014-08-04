define(['mmRequest'], function() {
	return {
		init: function(step) {
			// avalon.ajax({
				// url: 'http://pro.jfpal.com/api/?r=faq.help.phonedetect',
				// type: 'get',
				// success: function(data) {
				// 	if (data.success) {
						require('../modules/surPho', function(surPho) {
							surPho.init(step, winObj.surPho);
						});
			// 		} else {
			// 			alert(respData.msg);
			// 		}
			// 	},
			// 	error: function(data) {
			// 		alert('请检查当前网络');
			// 	}
			// });
		}
	}
});