define(function(require) {
    $('html, body').height('100%');

    var apiUrl = require('../apiConfig');

    var curStep;

    var fwP; //判断哪一页跳转到此页
    var isMod; //图片是否被修改过
    var productInfo;
    var imgData; //用户上传的图像

    var GoodsDetail = Backbone.Model.extend({
        url: apiUrl.addr + '?r=store.product.detail',
        sync: function() {
            var self = this;
            $.ajax({
                url: this.url,
                type: 'get',
                data: {
                    product_id: sessionStorage.category_id
                },
                success: function(data) {
                    if (data.success) {
                        productInfo = data.product;
                        pubGoodsDetailsView.render(3, data.product);
                        //显示页面
                        require.async('../nav', function(nav) {
                            nav.init(curStep);
                        });
                        $('#loading').fadeOut(200);
                    } else {
                        self.goBackUrl();
                        $('#loading').fadeOut(200, function() {
                            alert(data.msg, function() {}, '提示', '确定');
                        });
                    }
                },
                error: function() {
                    self.goBackUrl();
                    $('#loading').fadeOut(200, function() {
                        alert('请检查当前网络', function() {}, '提示', '确定');
                    });
                }
            });
        },
        goBackUrl: function() {
            switch (curStep) {
                case '3':
                    app_router.navigate('!pubGoods', {trigger: false});
            }
        }
    });

    var delProduct = Backbone.Model.extend({
        url: apiUrl.addr + '?r=store.product.delete',
        sync: function() {
            var self = this;
            $.ajax({
                url: this.url,
                type: 'post',
                data: {
                    product_id: productInfo.id
                },
                success: function(data) {
                    if (data.success) {
                        $('#loading').fadeOut(200, function() {
                            alert('产品删除成功', function() {
                                app_router.navigate('!pubGoods/3', {trigger: true});
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

    var UpdateProduct = Backbone.Model.extend({
        url: apiUrl.addr + '?r=store.product.update',
        sync: function() {
            if (isMod == 1) {
                this.upLoadInfo();
            } else if (isMod == 0) {
                this.ajaxInfo(0);
            } else {
                this.ajaxInfo(2);
            }
        },
        upLoadInfo: function() {
            console.log(imgData);
            if (imgData) {
                var self = this;
                var ft = new FileTransfer();
                var options = new FileUploadOptions();
                options.fileKey = "image";
                options.params = {
                    tinyshop_id: sessionStorage.tinyshop_id
                };
                ft.upload(imgData, encodeURI(apiUrl.addr + "?r=store.product.imagecreate"), function(data) {
                    var resp = JSON.parse(data.response);
                    if (resp.success) {
                        self.ajaxInfo(1, resp.image);
                    } else {
                        $('#loading').fadeOut(200, function() {
                            alert('data.msg', function() {}, '提示', '确定');
                        });
                    }
                }, function(error) {
                    $('#loading').fadeOut(200, function() {
                        alert('图片上传失败', function() {}, '提示', '确定');
                    });
                }, options);
            }
        },
        ajaxInfo: function(state, img) {
            var imgId;
            switch (state) {
                case 0:
                    imgId = productInfo.image;
                    break;
                case 1:
                    imgId = img.id;
                    break;
                case 2:
                    imgId = JSON.parse(sessionStorage.goodsInfo).image_id;
            }
            $.ajax({
                url: this.url,
                type: 'post',
                data: {
                    product_id: productInfo.id,
                    tinyshop_id: sessionStorage.tinyshop_id,
                    image_id: imgId,
                    name: $('.good_name').val(),
                    price: $('.good_price').val(),
                    information: $('.good_des').val()
                },
                success: function(data) {
                    if (data.success) {
                        $('#loading').fadeOut(200, function() {
                            alert('保存成功', function() {
                                app_router.navigate('!pubGoods/3', {trigger: true});
                            }, '提示', '确定');
                        });
                    } else {
                        $('#loading').fadeOut(200, function() {
                            alert('data.msg', function() {}, '提示', '确定');
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

    var createProduct = Backbone.Model.extend({
        url: apiUrl.addr + '?r=store.product.create',
        sync: function() {
            if (isMod == 2) {
                this.ajaxInfo(1);
            } else {
                this.upLoadInfo();
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
                ft.upload(imgData, encodeURI(apiUrl.addr + "?r=store.product.imagecreate"), function(data) {
                    var resp = JSON.parse(data.response);
                    if (resp.success) {
                        self.ajaxInfo(0, resp.image);
                    } else {
                        $('#loading').fadeOut(200, function() {
                            alert('data.msg', function() {}, '提示', '确定');
                        });
                    }
                }, function(error) {
                    $('#loading').fadeOut(200, function() {
                        alert('图片上传失败', function() {}, '提示', '确定');
                    });
                }, options);
            }
        },
        ajaxInfo: function(state, img) {
            var imgId = (state == 0) ? img.id : JSON.parse(sessionStorage.goodsInfo).image_id;
            $.ajax({
                url: this.url,
                type: 'post',
                data: {
                    mobile_no: context.user.mobileNo,
                    image_id: imgId,
                    name: $('.good_name').val(),
                    price: $('.good_price').val(),
                    information: $('.good_des').val()
                },
                success: function(data) {
                    if (data.success) {
                        $('#loading').fadeOut(200, function() {
                            alert('产品创建成功', function() {
                                app_router.navigate('!pubGoods/3', {trigger: true});
                            }, '提示', '确定');
                        });
                    } else {
                        $('#loading').fadeOut(200, function() {
                            alert('data.msg', function() {}, '提示', '确定');
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
       
    var PubGoodsDetailsView = Backbone.View.extend({
        el: '#pub_goods_details',

        model: new GoodsDetail(),

        updateModel: new UpdateProduct(),

        delModel: new delProduct(),

        createModel: new createProduct(),

        render: function(state, data) {
            if (state != 4 || fwP != 3) {
                this.$('.good_name').val(data.name);
                this.$('.good_price').val(data.price);
                this.$('.good_des').val(data.information);
            }
            this.$('.effect_icon').css('background-image', 'url(' + data.image_src + ')').attr('data-hasImg', '1');
        },

        events: {
            'click .effect_icon': 'show_ul',
            'focus input': 'hide_ul',
            'focus textarea': 'hide_ul',
            'click .last': 'hide_ul',
            'click li.first': 'to_goods_library',
            'click .second': 'getPic',
            'click .third': 'getPic',
            'touchstart .global_button': 'taped',
            'touchend .global_button': 'notap',
            'click .global_button.first': 'cDI',
            'click .global_button.last': 'delProduct',
            'touchstart li': 'taped',
            'touchend li': 'notap'
        },

        show_ul: function() {
            this.$('ul').fadeIn(200);
        },

        hide_ul: function() {
            this.$('ul').hide();
        },

        to_goods_library: function(e) {
            this.$('ul').hide();
            var obj = $(e.target);
            app_router.navigate(obj.attr('rel'), {trigger: true});
            this.$('ul').hide();
        },

        getPic: function(e) {
            this.$('ul').hide();
            var self = this;
            var obj = $(e.target);
            var sourceType = obj.hasClass('second') ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
            navigator.camera.getPicture(function(data) {
                imgData = data;
                self.$('.effect_icon').css('background-image', 'url(' + data + ')').attr('data-hasImg', '1');
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

        cDI: function() {
            var reg = /^(?:[1-9][0-9]*(?:\.[0-9]+)?|0(?:\.[0-9]+)?)$/;
            var txt = this.$('.good_price').val();
            var hasImg = this.$('.effect_icon').attr('data-hasImg');

            if (hasImg == '0') {
                alert('请上传图片', function() {}, '提示', '确定');
                return;
            } 
            if(this.$('.good_name').val() == '') {
                alert('请输入商品名称', function() {}, '提示', '确定');
                return;
            } 
            if (this.$('.good_price').val() == '') {
                alert('请输入商品价格', function() {}, '提示', '确定');
                return;
            } 
            if (!reg.test(txt)) {
                alert('商品价格格式错误，请检查', function() {}, '提示', '确定');
                return;
            } 
            if (this.$('.good_price').val() * 1 > 10000) {
                alert('商品单价不得超过一万元', function() {}, '提示', '确定');
                return;
            } 
            if (this.$('.good_des').val() == '') {
                alert('请输入商品描述', function() {}, '提示', '确定');
                return;
            } 

            $('#loading').fadeIn(200);
            if (fwP == 2) {
                this.createModel.save();
            } else if (fwP == 3) {
                this.updateModel.save();
            }
        },

        confirm_delete: function() {
            $('#loading').fadeIn(200);
            this.delModel.save();
        },

        delProduct: function() {
            var self = this;
            confirm('确认删除产品？', function(index) {
                if (index == 1) {
                    self.confirm_delete();
                }  
            }, '提示', ['确定', '取消']);
        },

        taped: function(e) {
        	var obj = $(e.target);
        	obj.addClass('taped');
        },

        notap: function(e) {
        	var obj = $(e.target);
        	obj.removeClass('taped');
        }
    });

    var pubGoodsDetailsView = new PubGoodsDetailsView();

    return {
        init: function(step) {
            imgData = '';
            if (step == '2') {
                $('.effect_icon').removeAttr('style').attr('data-hasImg', '0');
                $('.good_name, .good_price, .good_des').val('');
                $('#pub_goods_details .global_button').hide();
                $('#pub_goods_details a.first').css('display', 'block');
                fwP = 2;

                require.async('../nav', function(nav) {
                    nav.init(step);
                });
            } else if (step == '3' || step == '4') {
                if (step == '3') {
                    curStep = step;
                    $('#loading').fadeIn(200);
                    pubGoodsDetailsView.model.fetch();
                    $('#pub_goods_details .global_button').css('display', 'block');
                    fwP = 3;
                    isMod = 0;
                } else if (step == '4') {
                    pubGoodsDetailsView.render(4, JSON.parse(sessionStorage.goodsInfo));
                    isMod = 2;

                    require.async('../nav', function(nav) {
                        nav.init(step);
                    });
                }
            } else {
                require.async('../nav', function(nav) {
                    nav.init(step);
                });
            }
        }
    };
});