var goodsData; //热门商品数据
var gwc = {}; //存放购物车商品信息

//活动入口检测
$.ajax({
	type:'get',
	url:gb.ajaxUrl+"r=user/send&mark=0",
	dataType:'jsonp',
	success:function(mes){
		console.log(mes)
		if(mes.msg=="用户未登录"||mes.data.status==0){
			$("body").addClass("noslide");
			$("body").after("<div class='bg'></div><div class='img18'><img class='bg18' src='../img/huodong/huodong18.png'/></div><div class='closebags'></div>");
			$(".img18").click(function(){
				window.location.href="../html/huodong/red-bags.html"
			})
			$(".closebags").click(function () {
				$(".bg").remove();
				$(".img18").remove();
				$(".closebags").remove();
				$("body").removeClass("noslide");
			})
		}
	}
})
//banner数据
$.ajax({
		type: 'GET',
		url: gb.ajaxUrl + "r=shop/banner",
		async: true,
		dataType: 'jsonp',
		success: function(msg) {
			for(var i = 0, l = msg.data.length; i < l; i++) {
				$('#swipe-wrap').append('<figure><div class="piuture"><a href="' + msg.data[i].url + '"><img src="' + msg.data[i].thumb + '"/></a></div></figure>');
				$('#position').append('<li></li>');
			}
			$('#position li').eq(0).addClass('on');
			//lunbo
			var slider = Swipe(document.getElementById('slider'), {
				auto: 3000,
				speed: 800,
				continuous: true,
				callback: function(pos) {
					var i = bullets.length;
					while(i--) {
						bullets[i].className = ' ';
					}
					bullets[pos].className = 'on';
				}
			});
			var bullets = document.getElementById('position').getElementsByTagName('li');
		}
	})
	//<h2 class="partTitle"><span class="partTitleL">最新揭晓</span></h2>
	//倒计时数据
$.ajax({
		type: 'GET',
		url: gb.ajaxUrl + "r=shop/newest",
		async: true,
		dataType: 'jsonp',
		success: function(msg) {
			var str = "";
			if(msg.data == false) {
				$('#jijiang').html(str);
			} else {
				var i = 0;
				var l = msg.data.length;
				l < 4 ? l : l = 3;
				str = '<div id="new"><div id="newContent" class="box-flex">'
				for(i; i < l; i++) {
					if(msg.data[i].type == 1) {
						str += '<div id="' + msg.data[i].brand_id + '" periods="' + msg.data[i].periods + '" class="box-flex-item"><div class="newFirst-pic"><img src="' + msg.data[i].img + '"/></div><div class="newFirst-lotterytime"><span class="newFirst-text">倒计时</span><span class="new-time red"></span></div></div>';
					} else {
						var _name;
						var Chinese = new RegExp("[\u4e00-\u9fa5]");
						if(Chinese.test(msg.data[i].username)) {
							_name = msg.data[i].username.slice(0,4) + '..';
						} else {
							_name = msg.data[i].username;
						}
						
						str += '<div id="' + msg.data[i].brand_id + '" periods="' + msg.data[i].periods + '" class="box-flex-item"><div class="newFirst-pic"><img src="' + msg.data[i].img + '"/></div><div class="newFirst-lotterytime"><span class="newFirst-text">恭喜<b>' + _name + '</b>获奖</span></div></div>'
					}
				}
				str += '</div></div>';
				$('#jijiang').html(str);
				var a = msg.data;
				var l = msg.data.length;
				if(l >= 3) {
					if(msg.data[0].type == 1 && msg.data[1].type == 1 && msg.data[2].type == 1) {
						daojishi(0, a[0]);
						daojishi(1, a[1]);
						daojishi(2, a[2]);
					} else if(msg.data[0].type == 1 && msg.data[1].type == 1 && msg.data[2].type != 1) {
						daojishi(0, a[0]);
						daojishi(1, a[1]);
					} else if(msg.data[0].type == 1 && msg.data[1].type != 1 && msg.data[2].type != 1) {
						daojishi(0, a[0]);
					}
				} else if(l == 2) {
					if(msg.data[0].type == 1 && msg.data[1].type == 1) {
						daojishi(0, a[0]);
						daojishi(1, a[1]);
					} else if(msg.data[0].type == 1 && msg.data[1].type != 1) {
						daojishi(0, a[0]);
					}
				} else if(l == 1) {
					if(msg.data[0].type == 1) {
						daojishi(0, a[0]);
					}
				}
			}
		}
	})
	//倒计时函数
function daojishi(n, a) {
	var time = Number(a.time);
	var t = gb.getServerTime() + '';
	var nowTime = Number(t.slice(0, t.length - 3));
	var num = time - nowTime;
	console.log(new Date(Number(a.time + '000')));
	console.log(new Date(gb.getServerTime()));
	console.log(num);
	var timer = setInterval(function() {
		if(num == 0) {
			$('.newFirst-lotterytime').eq(n).html('正在开奖...')
			$.ajax({
				type: 'GET',
				url: gb.ajaxUrl + "r=shop/open-user",
				async: true,
				dataType: 'jsonp',
				data: {
					'periods': $('#newContent>div').eq(n).attr('periods')
				},
				success: function(msg) {
					$('.newFirst-lotterytime').eq(n).html('<span class="newFirst-text">恭喜<b>' + msg.data.username + '</b>获奖</span>')
				}
			})
		}
		var hour = parseInt(num / 3600);
		var minutes = parseInt((num % 3600) / 60);
		var second = (num % 3600) % 60;
		minutes > 9 ? minutes : minutes = "0" + minutes;
		second > 9 ? second : second = "0" + second;
		hour > 9 ? hour : hour = "0" + hour;
		$('.new-time').eq(n).html(hour + ":" + minutes + ":" + second);
		num--;
	}, 1000);
}
//热门数据
$.ajax({
	type: "GET",
	url: gb.ajaxUrl + "r=shop/recommend",
	async: true,
	dataType: 'jsonp',
	data: {
//		"class_id": 1,  为1只是显示手机热门商品
		"term": 2
	},
	success: function(msg) {
		console.log(msg)
		goodsData = msg.data.list;
		var str = '';
		for(var i = 0, l = goodsData.length; i < l; i++) {
			var obj = goodsData[i];
			var region = ' good-region-' + obj.region;
			var per = Math.floor(obj.now_people / obj.total_people * 100) + '%';
			str += '<div id="' + obj.id + '"  periods="' + obj.periods + '">' +
				'<div class="frame' + region + '">' +
				'<div class="hot-img">' +
				'<img src="' + obj.img + '"/>' +
				'</div>' +
				'<div class="hot-img-info">' +
				'<p class="hot-img-text">' + obj.name + '</p>' +
				'<div class="progressBar">' +
//				'	<p class="progressBar-text">揭晓进度<strong>' + per + '</strong></p><p class="jindutiao"><i class="color" style="width: ' + per + ';"></i></p>' +
				'<p class="jindutiao"><i class="color" style="width: ' + per + ';"></i></p>' +
				'</div>' +
				'<p class="goods-info">' +
				'<span class="total">'+obj.total_people+'<br/>总需</span>' + 
				'<span class="remain"><b>'+obj.residue_people+'</b><br/>剩余</span>'	+					
				'</p>'+
				'</div>' +
				'<div class="iconfont red plus">&#xe602;</div>' +
				'</div>' +
				'</div>';

		}
		$('#hot').html(str);
		setTimeout(function() {
			function callBack(id) {
				$("#" + id).find('.frame').addClass('on');
			}
			app.gwc.showStateOfGoods(goodsData, callBack);
		}, 10)
	}
});
$('#jijiang').on('tap', '#newContent>div', function() {
		window.location.href = 'goods/goods_details.html?periods=' + encodeURI($(this).attr('periods'));
	})
	//点击加入购物车按钮
	//$('#hot').on('tap', '.plus', function(e) {		
	//	//商品列表样式修改	
	//	if($(this).parent().is('.on')) {
	//		function deleteEventCB(){
	//			$(this).parent().removeClass('on');
	//		}
	//		app.gwc.deleteEvent.apply(this,[$(this).parent().parent().attr('id'),deleteEventCB]);
	//	} else {
	//		function addEventCB(){
	//			console.log($(this))
	//			$(this).parent().addClass('on');
	//		}
	//		app.gwc.addEvent.apply(this,[$(this).parent().parent(),goodsData,addEventCB]);
	//	};	
	//});

$('#hot').on('tap', '#hot>div', function(e) {
	if($(e.target).is('.plus')) {
		var _this = $(e.target);
		//商品列表样式修改	
		if(_this.parent().is('.on')) {
			function deleteEventCB() {
				_this.parent().removeClass('on');
			}
			app.gwc.deleteEvent.apply(this, [_this.parent().parent().attr('id'), deleteEventCB]);
		} else {
			function addEventCB() {
				_this.parent().addClass('on');
			}
			console.log(goodsData);
			app.gwc.addEvent.apply(this, [_this.parent().parent(), goodsData, addEventCB]);
		};
	} else {
		window.location.href = 'goods/goods_details.html?periods=' + encodeURI($(this).attr('periods'));
	}
})
