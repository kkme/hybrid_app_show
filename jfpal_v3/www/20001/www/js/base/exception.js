
define(function(require,exports){
	var Layout = require('./layout');
	var Tool = require('./tool');
	var confirm = require('../widget/confirm/confirm');
	
	exports.redirect = function(){
		var tar = '?';
		var obj = Tool.searchJSON(location.search);
		if(!obj.numberStrings) return;
		for(var i in obj){
			if(i == 'sid'){
				tar += 'sid=' + obj.sid
			}
		}
		C.Config.changeUrl(location.href.replace(location.search,tar));
	};
	
	exports.removeWait = function(){
		Layout.removeMaskLayer();
		$('.wait').remove();
	};
	
	exports.initialize = function(errcode){
		var self = this;
		Layout.initialize().renderView('#exceptionTemp',99);
		C.Config.setToolBar();
		self.removeWait();
		_.delay(function(){
			if(errcode === 'NEW_LOTTERY_USER'){
				window.cbox = new confirm.initialize({
					onConfirm: function(){
						C.Config.changeUrl(location.href.replace(location.hash,'#!newuser/3'));
					},
					onCancel: function(){
						C.Config.changeUrl(location.href.replace(location.hash,''));
					},
					content: '继续购彩需补充身份信息，现在就去?'
				});
				
			}else{
				$('#errShow').html(C.Config.exception[errcode]);
				exports.redirect();
			}	
		},500);

		
	};

	
});
