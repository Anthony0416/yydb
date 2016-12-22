//判断微信登录和app登录
var system = null;
//判断是否从活动页面跳转过来
var _login = gb.url.getParam('redirectUrl');
if(_login) {
	$('.wechat_public').attr('href','https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb6a080e93974bc1d&redirect_uri=http://fenliulianglo.com/tiduihulian/share/project/duobao/H5/dist/html/user/login.html?redirectUrl='+ _login +'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect')
}

$('#login').on('tap', function() {
	var phone = $('#phoneNum').val();
	var password = $('#password').val();
	var verification = $('#input1').val();
	var next;
	if(phone.length != 11) {
		$.dialog({
			content: '请检查手机号码',
			title: "alert",
			time: 2000
		});
	} else {
		//验证码判断
		if(!verification) {
			$.dialog({
				content: '请输入验证码',
				title: "alert",
				time: 2000
			});
		} else {
			next = (verification != code2) ? false : true;
		}

		if(next == true) {
			if(!password) {
				$.dialog({
					content: '请检查密码',
					title: "alert",
					time: 2000
				});
			} else {
				
				$.ajax({
					type: 'Get',
					dataType: 'jsonp',
					url: gb.ajaxUrl + 'r=user/login',
					data: {
						"phone": phone,
						"password": hex_md5(password),
						"system":system
					},
					success: function(e) {
						if(e.code == '0') {
							
							gb.storage.set('PHPSESSID', e.data || '');
							var redirectUrl = decodeURI(gb.url.getParam('redirectUrl'));
							if(redirectUrl) {
								goOtherPage(redirectUrl);
							} else {
								app.action.href('person.html');
							}

						} else {
							$.dialog({
								content: e.msg,
								title: "alert",
								time: 2000
							});
						}

					}
				})

			}
		} else if(next == false) {
			$.dialog({
				content: '请检查验证码',
				title: "alert",
				time: 2000
			});

			createCode();
		}
	}
})

function goOtherPage(redirectUrl) {
	$.ajax({
		url: gb.ajaxUrl + "r=user/index",
		dataType: 'jsonp',
		success: function(data) {
			if(data && data.code == '0') {
				data = data.data[0];
				app.user.setUserInfo(data);
				app.action.href(redirectUrl);
			} else if(data.code == '-1') {
				gb.storage.delete('PHPSESSID');
				app.action.href('login.html');
			}
		}
	})
}


if(browser.versions.mobile) {
	//判断是否是移动设备打开。browser代码在下面
	var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		system = 1;
		//在微信中打开
		$('.quick_login a.wechat_public').css('display', 'inline-block');
		$('a.quick_qq').hide();
	} else if(ua.match(/WeiBo/i) == "weibo") {
		//在新浪微博客户端打开
	} else if(ua.match(/QQ/i) == "qq") {
		//在QQ空间打开
	} else if(browser.versions.android || browser.versions.ios) {
		system = 0;
		//是否在安卓浏览器打开

		//微信登录
		var auths = {};

		document.addEventListener("plusready", function() {
			plus.oauth.getServices(function(services) {
				console.log(services)
				for(var i in services) {
					var service = services[i];
					auths[service.id] = service;
				}

				console.log(auths)
			}, function(e) {
				//							alert( "获取分享服务列表失败："+e.message+" - "+e.code );
			});
		}, false);

		function login() {
			var weChat = auths['weixin'];
			var _obj = {};
			
			weChat.login(function() {
				console.log("登录认证成功");
				plus.nativeUI.showWaiting();
				weChat.getUserInfo(function() {
					console.log(weChat.userInfo);
					_obj.iden = weChat.userInfo.unionid;
					_obj.type = 2;
					_obj.img = weChat.userInfo.headimgurl;
					_obj.username = weChat.userInfo.nickname;
					
					$.ajax({
						type:"get",
						url:gb.ajaxUrl + "r=user/third-login",
						dataType:'jsonp',
						data:_obj,
						success:function(e) {
							if(e.code == 0) {
								gb.storage.set('PHPSESSID', e.data || '');
								var redirectUrl = decodeURI(gb.url.getParam('redirectUrl'));
								if(redirectUrl) {
									goOtherPage(redirectUrl);
									plus.nativeUI.closeWaiting();
								} else {
									app.action.href('person.html');
									plus.nativeUI.closeWaiting();
								}
							}
						},
						error:function(e) {
							console.log(e);
						}
						
					});
				});
			}, function(e) {
				console.log("登录认证失败:");
				console.log(e);
				console.log("[" + e.code + "]" + e.message);
			});
		}

		function logout() {
			auths['weixin'].logout(function() {
				console.log("duichu");

			}, function(e) {
				console.log("登录认证失败:");
			});
		}

		$('a.wechat_app').css('display', 'inline-block').on('click', function() {
			plus.nativeUI.showWaiting();
			login();
		})
	}
} else {
	//否则就是PC浏览器打开
}

//微信授权登录
var _url = window.location.href;
//var _url = 'http://fenliulianglo.com/tiduihulian/share/project/duobao/H5/dist/html/index.html?redirectUrl=../../user/lll/lottery.html&code=031Z7V1G0O3iv62q1v1G0rEY1G0Z7V1e&state=STATE';
//var _index = (_url.indexOf('?') == -1) ? false : _url.indexOf('?') + 6;
var _index = false;

//处理微信登录成功后跳回，活动页面
if(_url.indexOf('redirectUrl') > -1) {
	_index = _url.indexOf(_login) + _login.length + 6;
} else {
	_index = (_url.indexOf('?') == -1) ? false : _url.indexOf('?') + 6;
}

//判断是否微信打开
if(_index && _url.indexOf('code=')>-1) {
	var _url2 = _url.slice(_index);
	var code = _url2.slice(0, _url2.indexOf('&'));
	var _obj = {
		code: code,
	};

	//发起登录请求
	$.ajax({
		type: "get",
		url: gb.ajaxUrl + "r=user/three-login",
		dataType: 'jsonp',
		async: true,
		data: _obj,
		success: function(re) {
			console.log(re);
			console.log('success')
			gb.storage.set('PHPSESSID', re.data || '');
			var redirectUrl = decodeURI(gb.url.getParam('redirectUrl'));
			if(redirectUrl) {
				goOtherPage(redirectUrl);
			} else {
				app.action.href('person.html');
			}
		},
		error: function(e) {
			console.log(e);
			console.log('error')
		}
	});

}