// 入口模块
define('main', ['mmRequest', './chartConfig'], function(request, chart) {
	// 全局共用的对象
	// window.obj = {
	// 	API_URL: 'http://pro.jfpal.com:80/api/'
	// };

	// // 取回销售数据
	// var getData = function(firstTimeFlag, date, dataFlag) {
	// 	avalon.ajax({
 //            url: obj.API_URL + '?r=store.report.dashboard',
 //            type: 'get',
 //            data: {
 //                // Todo
 //            },
 //            success: function(data) {
 //                if (data.success) {
                    
 //                } else {
 //                	load.bool = false;
 //                    alert(data.msg, function() {}, '提示', '确定');
 //                }
 //            },
 //            error: function() {
 //                load.bool = false;
 //                alert('请检查当前网络', function() {}, '提示', '确定');
 //            }
 //        });
	// };

	getData(first, newDate(), 2); // 首次进入页面,获取截止到今天的前七天销售额和今天销售量前五的商品

	var load = avalon.define('loading', function(vm) {
		vm.bool = false;
	});

	// 初始化 canvas 图表数据,返回图表对象
	var reportObj = (function() {
		var line = new Chart(document.querySelector('#wkda').getContext('2d')).Line(chart.data, chart.options);
		var bar = new Chart(document.querySelector('#top_items').getContext('2d')).Bar(chart.data, chart.options);
		return 'test';
	})();

	// 日期格式检查
	var verDateFormate = function(flag, date) {
		if (date == '') {
			alert('日期不能为空');
			return;
		}
		getData(second, date, flag); // 获取截止到用户所选日期前七天销售额或者销售前五商品
	};

	// 
	var report = avalon.define('report', function(vm) {
		vm.exDate = ''; // 销售额截止日期
		vm.verFmt = function() {
			verDateFormate(0, vm.exDate);
		};

		vm.chDate = ''; // 前五商品日期
		vm.verDate ＝ function() {
			verDateFormate(1, vm.exDate);
		};
	});

	avalon.scan();
});