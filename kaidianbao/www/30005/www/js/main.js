// 入口模块
define('main', ['mmRequest', './chartConfig'], function(request, chart) {
	// 处理 ajax 返回数据
	var dealRespData = function(flag, data) {
		var labels = [],
			tData = [];
		if (flag == 0) {
			data.forEach(function(value, index) {
				labels.push(value['date']);
				tData.push(value['amount']);
			});
			return [labels, tData];
		} else {
			data.forEach(function(value, index) {
				labels.push(value[0]);
				tData.push(value[1]);
			});
			return [labels, tData];
		}
	};

	// 取回销售数据
	var getData = function(flag, date) {
		var fromDate = (flag == 0) ? date[0] : date[1];
		avalon.ajax({
            url: 'http://pro.jfpal.com/api/?r=store.report.dashboard',
            type: 'get',
            data: {
                from: fromDate,
                to: date[1]
            },
            success: function(data) {
            	load.bool = false;
                if (data.success) {
                    if (flag == 0) {
                    	var arr = dealRespData(0, data.sales);
                    	resetLineReport(arr[0], arr[1]);
                    } else {
                    	var arr = dealRespData(1, data.products);
                    	resetBarReport(arr[0], arr[1]);
                    }
                } else {
                    alert(data.msg, function() {}, '提示', '确定');
                }
            },
            error: function() {
                load.bool = false;
                alert('请检查当前网络', function() {}, '提示', '确定');
            }
        });
	};

	var load = avalon.define('loading', function(vm) {
		vm.bool = true;
	});

	// 处理所需数据
	var dealChartData = function(labels, data) {
		var crt = chart.data;
		crt.labels = labels;
		crt.datasets[0]['data'] = data;
		return crt;
	};

	// 初始化 canvas 图表数据,返回图表对象
	var resetLineReport = function(labels, data) {
		line = null; // 重新创建图表对象前，先回收先前对象
		var crt = dealChartData(labels, data);
		// 创建新的图表对象
		line = new Chart(document.querySelector('#wkda').getContext('2d')).Line(crt, chart.options);
	};
	var resetBarReport = function(labels, data) {
		bar = null; // 重新创建图标对象前，先回收先前对象
		var crt = dealChartData(labels, data);
		// 创建新的图表对象
		bar = new Chart(document.querySelector('#top_items').getContext('2d')).Bar(crt, chart.options);
	};

	// 日期格式检查
	var verDateFormate = function(date) {
		if (date == '') {
			alert('日期格式有误');
			return false;
		}
		return true;
	};

	// 默认是今日日期,或者格式化开始日期
	var getDt = function(flag, date) {
		var sDate = (flag == 0) ? (new Date()) : (new Date((new Date(date)).setDate((new Date(date)).getDate() - 7))),
		    year = sDate.getFullYear(),
		    month = sDate.getMonth() + 1,
		    date = sDate.getDate(),
		    month = (month < 10) ? ('0' + month) : month,
		    date = (date < 10) ? ('0' + date) : date;
		    
		return (year + '-' + month + '-' + date);
	};

	// 格式化日期为后台接口需要的数据格式
	var formateDate = function(flag, date) {
		if (flag == 0) {
			var fromDate = getDt(1, date);
			fromDate = fromDate.split('-').join('');
		}
		var toDate = date.split('-').join('');
		return [fromDate, toDate];
	};

	var report = avalon.define('report', function(vm) {
		vm.exDate = getDt(0); // 销售额截止日期
		vm.verFmt = function(date) {
			if (verDateFormate(date)) {
				var fmdt = formateDate(0, date);
				load.bool = true;
				getData(0, fmdt); // 获取截止到用户所选日期前七天销售额
			};
		};

		vm.chDate = getDt(0); // 前五商品日期
		vm.verDate = function(date) {
			if (verDateFormate(date)) {
				var fmdt = formateDate(1, date);
				load.bool = true;
				getData(1, fmdt); // 获取截止到用户所选日期销售前五商品
			}
		};
	});

	avalon.scan();
});