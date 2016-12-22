//搜索函数
function sousuo(a){
	if(!a){
		$.dialog({
	        content : '请检查搜索内容',
	        title: "alert",
	        time : 2000
    	});
	}else{
		window.location.href="search_result.html?search=" + a;
	}
}
//输入关键词搜索
$('#sousuo').tap(function(){
	sousuo(encodeURI($('#search_box').val()));
})
//点击热词搜索
$('.popular-list').on('tap','li',function(){
	sousuo($(this).text());
	
})
