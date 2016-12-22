var val = decodeURI(gb.url.getParam('search'));
$.ajax({
	type: 'Get',
	dataType: 'jsonp',
	url: gb.ajaxUrl + 'r=shop/search',
	data: {"search":val},
	success: function(msg){
		var l = msg.data.length;
		$('#search_num').text(l);
		var str = '';
		for(var i = 0;i<l;i++){
			var item = msg.data[i];
			//商品简介处理
			var info = "";
			!item.info?info:info = item.info;
			//拼字符串
			str += '<div periods="' + item.periods + '" class="good-item"><div class="all-goods-img"><img src="' + item.img + '"/></div><div class="all-goods-info"><p class="all-goods-info-name  test-ellipsis">' + item.name + '</p><p class="all-goods-info-introduce  test-ellipsis">' + info + '</p><div class="all-goods-info-progressBar"><p class="jindutiao"><span class="bar" ><i class="color" style="width:'  + item.now_people/item.total_people*100 + '%"></i></span></p><p class="all-goods-info-text-2"><span>需' + item.total_people + '人次</span><span>剩<b>' + item.residue_people + '</b>人次</span></p></div></div></div>'
		}
		$('#all-goods').html(str);
	}
})

//点击跳转商品详情页
$('#all-goods').on('tap','.good-item',function(){
	window.location.href='goods_details.html?periods=' + encodeURI($(this).attr('periods'));
})
