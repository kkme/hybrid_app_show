define(['mmRequest'], function() {
	return {
		init: function(step) {
			// avalon.ajax({
			// 	url: 'http://pro.jfpal.com/api/?r=faq.help.phonedetect',
			// 	type: 'get',
			// 	success: function(data) {
					// if (data.success) {
						require('../modules/index', function(index) {
							index.init(step, winObj.brand);
						});
					// } else {
					// 	alert(respData.msg);
					// }
				// },
				// error: function(data) {
				// 	alert('请检查当前网络');
				// }
			// };
		}
	}
});