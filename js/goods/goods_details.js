//存放购物车商品信息
var gwc = {};
var goodsData; //后台获取数据
//从当前连接取参数
var val = decodeURI(gb.url.getParam('periods'));
//服务器获取商品详细数据
$.ajax({
	type: 'Get',
	dataType: 'jsonp',
	url: gb.ajaxUrl + 'r=shop/deta',
	data: {"periods":val},
	success: function(msg){
		goodsData = msg.data;
		//图片
		var image = msg.data.img;
		for(var i = 0,l = image.length;i<l;i++){
			$('#swipe-wrap').append('<figure><div class="piuture"><img src="' + image[i] + '"/></div></figure>');
			$('#position').append('<li></li>');
		}
		$('#position li').eq(0).addClass('on');
		//lunbo
		var slider = Swipe(document.getElementById('slider'), {
			continuous: true,
			callback: function(pos) {
				var i = bullets.length;
				while(i--){
					bullets[i].className = ' ';
				}
				bullets[pos].className = 'on';
			}
		});
		var bullets = $('#position li');
		//商品名
		$('#goodsname').text(msg.data.name);
		//商品介绍
		$('#info').text(msg.data.info);
		//期号
		$('#qihao').text('期号：'+msg.data.periods);
		//进度条百分比
		var jindu = msg.data.now_people/msg.data.total_people*100 + '%';
		
		//--------------------------------------------------------------
		//进度条，倒计时，开奖信息
		var str = '';
		var btn = '';
		//倒计时
		var t = '<p class="jiexiao white bg-red">揭晓倒计时<span id="daojishi"></span>';
		//开奖结果
		var w = '<div><img src="../../img/category/win-icon.png" /><div class="win_img"><img src="' + msg.data.userimg +'" /></div><div class="win_ifo"><p class="jiexiao_result">获奖者：<b>' + msg.data.username + '</b></p><p>本期参与：' + msg.data.forIn + '人次</p><p>揭晓时间：' + msg.data.time + '</p></div></div><div class="jiexiao white bg-red"><p>老时时彩'+goodsData.ssc_periods+'期开奖号码：'+goodsData.opencode+'</p><p>开奖计算：('+goodsData.opencode+' % '+goodsData.total_people+') + 10000 = 幸运号码<span id="daojishi">' + msg.data.lucky_no + '</span></p></div>';
		//最新一期
		var n = '<div><p>最新一期正在火热进行</p><span id="new_periods" new_periods="' + msg.data.new_periods + '" class="bg-red">立即前往</span></div>';
		if(msg.data.status == 0){
			//进度条
			str = '<p class="jindutiao"><span class="bar" ><i class="color" style="width:' + jindu + '"></i></span></p><ul class="all-goods-info-text-2"><li id="total_people" class="text-renshu">总需' + msg.data.total_people + '人次</li><li class="text-number">剩余<b id="residue_people">' + msg.data.residue_people + '</b>人次</li></ul>';
			btn = '<div><span id="add" periods="' + msg.data.periods + '"  class="bg-red">加入清单</span></div>';
		}else if(msg.data.status == 1){
			//倒计时
			str = t;
			var openTime = '';
			openTime = msg.data.time;
			openTime = openTime.replace(/-/g,'/');
			var time = new Date(openTime).getTime();
			daojishi(time);
			btn = n;
		}else if(msg.data.status == 2){
			//倒计时
			str = t;
			var openTime = '';
			openTime = msg.data.time;
			openTime = openTime.replace(/-/g,'/');
			var time = new Date(openTime).getTime();
			daojishi(time);
			btn = '';
		}else if(msg.data.status == 3){
			//开奖结果
			str = w;
			btn = '';
		}else if(msg.data.status == 4){
			//开奖结果
			str = w;
			btn = n;
		}
		$('#data').html(str);
		$('#goodsBtn').html(btn);
		
		//--------------------------------------------------------------
		//查看夺宝号码
		var s = '';
		if(msg.data.loginOrBuy == 0){
			s = '<a href="../user/login.html?redirectUrl=../goods/goods_details.html?periods=' + msg.data.periods + '">请登录,</a>查看您的夺宝号码';
		}else if(msg.data.loginOrBuy == 1){
			s = '您未参与本期夺宝';
		}else if(msg.data.loginOrBuy == 2){
			s = '<a class="click" periods="' + msg.data.periods + '">点击查看您的夺宝号码</a>';
		}
		$('#buyNum').html(s);
		
		//--------------------------------------------------------------
		//选项
		var zilei = '<p id="tuwen">'
						+'<span>图文详情</span>'
						+'<span class="arr userArr"></span>'
					+'</p>'
					+'<p id="wangqi" product_id="' + msg.data.id + '">'
						+'<span>往期揭晓</span>'
						+'<span class="arr userArr"></span>'
					+'</p>';
		$('#zilei').html(zilei);
		gb.storage.set('img',msg.data.details_img);
		//--------------------------------------------------------------
		//参与记录
		var i;
		if(msg.data.list){
			var l = msg.data.list.length;
			var rec = '<p>夺宝记录</p>';
		for(i = 0; i < l; i++){
			var m = msg.data.list[i];
			rec += '<div><img src="' + m.img + '" /><a>' + m.username + '</a><span>参与<b>' + m.times + '</b>人次<i>&nbsp;&nbsp;' + m.time + '</i></span></div>'
		}
		$('#jilu').html(rec);
		}
	}
})

//倒计时函数
function daojishi(a){
	var t = gb.getServerTime() + '';
	var time = a - t + '';
	var num = Number(time.slice(0,time.length-3));
	var timer = setInterval(function(){
		if(num == 0) {
			document.location.reload();
		}
		var hour = parseInt(num / 3600);
		var minutes = parseInt((num % 3600) / 60);
		var second = (num % 3600) % 60;
		minutes > 9 ? minutes : minutes = "0" + minutes;
		second > 9 ? second : second = "0" + second;
		hour > 9 ? hour : hour = "0" + hour;
		$('#daojishi').html(hour + ":" + minutes + ":" + second);
		num--;
	}, 1000);
}

//点击查看夺宝号码
$('#buyNum').on('tap','.click',function(){
	var periods = $(this).attr('periods');
	$.ajax({
		type:"get",
		url: gb.ajaxUrl + "r=shop/lucky-number",
		dataType: 'jsonp',
		data: {"periods":periods},
		success: function(msg){
			var haoma = msg.data.join(',').replace(/,/g,"\n");
			haoma = haoma.replace(goodsData.lucky_no,'<span class="red">' + goodsData.lucky_no + '</span>')
			setTimeout(function(){
				$.dialog({
			        content : haoma,
			        title: null,
			        okText: '确定',
			        ok : function() {
			            null;
			        },
			        lock : false,
			    });
			},0);
		}
	});
	
	
})
//点击图文详情
$('#zilei').on('tap','#tuwen',function(){
	window.location.href='Graphic details.html';
})
//点击往期揭晓
$('#zilei').on('tap','#wangqi',function(){
	window.location.href='review.html?id=' + encodeURI($(this).attr('product_id'));
})
//点击加入清单
$('#goodsBtn').on('tap','#add',function(){

	var obj = {
		id:goodsData.id,
		periods:goodsData.periods,
		name:goodsData.name,
		total_people:goodsData.total_people,
		residue_people:goodsData.residue_people,
		img:goodsData.img[0],
		region:goodsData.region,
		price:goodsData.price
	}	
	app.gwc.addGood(obj);
	$.dialog({
        content : '已加入购物车',
        title: "ok",
        okText : '去支付',
        ok : function() {
        	app.action.href('../user/buyCar.html');
        },
        cancelText : '确定',
        cancel : function() {
            
        }
	});
})
//点击跳转最新一期
$('#goodsBtn').on('tap','#new_periods',function(){
	window.location.href='goods_details.html?periods=' + encodeURI($(this).attr('new_periods'));
})
