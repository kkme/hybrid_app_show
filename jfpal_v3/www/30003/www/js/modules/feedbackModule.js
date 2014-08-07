define(['avalon', 'text!../../view/templateHtml/feedback.html', 'mmRequest'], function(avalon, feedback) {
	avalon.ui['feedbackui'] = function(element, data, vmodels) {
		var vmodel = avalon.define(data.feedbackuiId, function(vm) {
			vm.$init = function() {
				element.innerHTML = feedback;
				avalon.scan(element, [vmodel].concat(vmodels));
			};

			// 需要提交的问题
			vm.problem = '';

			vm.$verify = function(problem) {
				if (problem != '') {
					return true;
				} else {
					alert('请填写反馈信息');
					return false;
				}
			};

			// 提交反馈数据
			vm.submitFeedback = function() {
				if (vm.$verify(document.querySelector('textarea').value)) {
					avalon.ajax({
				        url: 'http://pro.jfpal.com:80/api/?r=feedback.feedback.create',
				        type: 'post',
				        data: {
				            // TODO 先写死
				            mobile_no: '',  //手机号
							platform: '', // app系统
							app_version: '', // App版本号
							app_user: '', // 代理商号
							content: vm.problem, // 问题反馈内容
							os_info: '' // 系统信息
				        },
				        success: function(data) {
				            if (data.success) {
				            	alert('反馈提交成功');
				            } else {
				                alert('请检查网络设置');
				            }
				        },
				        error: function() {
				            alert('请检查网络设置');
				        }
				    });
				}
			};
		});
		return vmodel;
	};

	avalon.ui['feedbackui'].defaults = {};

	return avalon;
});