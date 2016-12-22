//判断微信登录和app登录
var system = null;

if(browser.versions.mobile) {
	//判断是否是移动设备打开。browser代码在下面
	var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		//在微信中打开
		system = 1;
	} else if(ua.match(/WeiBo/i) == "weibo") {
		//在新浪微博客户端打开
	} else if(ua.match(/QQ/i) == "qq") {
		//在QQ空间打开
	} else if(browser.versions.android || browser.versions.ios) {
		//是否在安卓浏览器打开
		system = 0;
	}
} else {
	//否则就是PC浏览器打开
}

$('#register-button').on('tap', function() {
	if(0 && !$('#userName').val()) {
		$.dialog({
			content: '请检查用户名',
			title: "alert",
			time: 2000
		});
		return;
	} else {
		var name = $('#userName').val();
		if(!(/^1[34578]\d{9}$/.test($('#phoneNum').val()))) {
			$.dialog({
				content: '请填写正确的手机号',
				title: "alert",
				time: 2000
			});
			return;
		} else {
			var phone = $('#phoneNum').val();
			var verification = $('.iden_code').val();
			var next;
			//验证码判断
			if(!verification) {
				$.dialog({
					content: '请输入验证码',
					title: "alert",
					time: 2000
				});
			} else {
				$.ajax({
					type: "get",
					url: gb.ajaxUrl + "r=user/check-code",
					dataType: 'jsonp',
					data: {
						phone: phone,
						code: verification,
					},
					success: function(re) {
						console.log(re);
						if(re.code == -1) {
							$.dialog({
								content: re.msg,
								title: "alert",
								time: 2000
							});
							next = false;
						} else if(re.code == 0) {
							next = true;
							if(next == true) {
								if($('#password').val() == $('#passwordChk').val() && ($('#password').val().length) >= 6) {
									var password = $('#password').val();
									$.ajax({
										type: 'GET',
										dataType: 'jsonp',
										url: gb.ajaxUrl + 'r=user/register',
										data: {
											"phone": phone,
											"password": hex_md5(password),
											"username": 'u' + phone.substr(5),
											"system": system
										},
										success: function(e) {
											if(e.code == 0) {
												console.log(e.msg);

												$.dialog({
													content: '注册成功',
													title: "ok",
													okText: '确认',
													ok: function() {
														app.action.href('login.html');
													},
												});

											} else {
												console.log(e.msg);
												$.dialog({
													content: e.msg,
													title: "alert",
													time: 2000
												});
												return;
											}
										}
									})
								} else {
									$.dialog({
										content: '请检查密码',
										title: "alert",
										time: 2000
									});
									return;
								}
							} else if(next == false) {
								//				$.dialog({
								//	        content : '请检查验证码',
								//	        title: "alert",
								//	        time : 2000
								//	    	});
								//	    	
								//	    	createCode();
							}
						}
					},
					error: function(e) {
						console.log(e)
					}
				});
				//				next = (verification != code2)?false:true;
			}

		}
	}

})