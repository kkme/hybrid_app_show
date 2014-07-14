define(function(require) {
    $('html, body').height('100%');
    
    var apiUrl = require('../apiConfig');

    var isMod; //图片是否被修改过
    var imgData; //用户上传的图像

    var UpdateTinyshop = Backbone.Model.extend({
        url: apiUrl.addr + '?r=store.tinyshop.update',
        sync: function() {
            if (isMod == 1) {
                this.upLoadInfo();
            } else {
                this.ajaxInfo(0);
            }
        },
        upLoadInfo: function() {
            if (imgData) {
                var self = this;
                var ft = new FileTransfer();
                var options = new FileUploadOptions();
                options.fileKey = "image";
                options.params = {
                    tinyshop_id: sessionStorage.tinyshop_id
                };
                ft.upload(imgData, encodeURI(apiUrl.addr + "?r=store.tinyshop.imagecreate"), function(data) {
                    var resp = JSON.parse(data.response);
                    if (resp.success) {
                        self.ajaxInfo(1, resp.image);
                    } else {
                        $('#loading').fadeOut(200, function() {
                            alert(data.msg, function() {}, '提示', '确定');
                        });
                        console.log(imgData);
                        console.log(sessionStorage.tinyshop_id);
                        console.log(data);
                    }
                }, function(error) {
                    $('#loading').fadeOut(200, function() {
                        alert('图片上传失败', function() {}, '提示', '确定');
                    });
                }, options);
            }
        },
        ajaxInfo: function(state, img) {
            var imgId = (state == 1) ? img.id : JSON.parse(sessionStorage.skInfo).image_id;
            $.ajax({
                url: this.url,
                type: 'post',
                data: {
                    mobile_no: context.user.mobileNo,
                    name: $('.tyspName').val(),
                    image_id: imgId
                },
                success: function(data) {
                    if (data.success) {
                        $('#loading').fadeOut(200, function() {
                            alert('福店修改成功', function() {
                                app_router.navigate('!myWeidian/4', {trigger: true});
                            }, '提示', '确定');
                        });
                    } else {
                        $('#loading').fadeOut(200, function() {
                            alert(data.msg, function() {}, '提示', '确定');
                        });
                    }
                },
                error: function() {
                    $('#loading').fadeOut(200, function() {
                        alert('请检查当前网络', function() {}, '提示', '确定');
                    });
                }
            });
        }
    });

    var ShopEidtView = Backbone.View.extend({
        el: '#shopEidt',

        model: new UpdateTinyshop(),

        initialize: function() {
            if (context.user.authenFlag == '3') {
                this.$('.cert').text('').addClass('addBg');
            }
        },

        render: function(data) {
            this.$('.camPic').css('background-image', 'url(' + data.image_src + ')');
            this.$('.tyspName').val(data.name);
            this.$('.tyspId').text(data.id);
        },

        events: {
            'click .camPic': 'showUl',
            'click .last': 'hideUl',
            'click .second': 'getPic',
            'click .third': 'getPic',
            'click .global_button': 'upLoadInfo',
            'touchstart .global_button': 'taped',
            'touchend .global_button': 'notap',
            'touchstart .getPic li': 'taped',
            'touchend .getPic li': 'notap',
        },

        showUl: function() {
            this.$('.getPic').show();
        },

        hideUl: function() {
            this.$('.getPic').hide();
        },

        getPic: function(e) {
            this.$('.getPic').hide();
            var self = this;
            var obj = $(e.target);
            var sourceType = obj.hasClass('second') ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
            navigator.camera.getPicture(function(data) {
                console.log(data);
                self.$('.camPic').css('background-image', 'url(' + data + ')');
                imgData = data;
                isMod = 1;
            }, function(error) {
                if (error != 'no image selected') {
                    alert('获取图片失败，请重新上传', function() {}, '提示', '确定');
                }
            }, {
                quality: 40,
                targetWidth: 200,
                targetHeight: 200,
                sourceType: sourceType,
                encodingType: Camera.EncodingType.JPEG,
                correctOrientation: true
            });
        },

        upLoadInfo: function() {
            if (this.$('.tyspName').val() != '') {
                $('#loading').fadeIn(200);
                this.model.save();
            } else {
                alert('请输入店铺名称', function() {}, '提示', '确定');
            }
        },

        taped: function(e) {
        	var obj = $(e.currentTarget);
        	obj.addClass('taped');
        },

        notap: function(e) {
        	var obj = $(e.currentTarget);
        	obj.removeClass('taped');
        }
    });

    var shopEidtView = new ShopEidtView();

    return {
        init: function(step) {
            isMod = 0;
            shopEidtView.render(JSON.parse(sessionStorage.skInfo));
        }
    };
});