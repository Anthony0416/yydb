var gwc = {}; //存放购物车商品信息

//var VMTypes = new Vue({
//el: '#types',
//data: {
//	defaultId:1, //默认显示的商品类型
//  items: []
//}
//});

var VMGoods = new Vue({
  el: '#all-goods',
  data: {
  	//class
  	noDataShow:false,
  	//data
    items: null,
    type : 1,//当前显示的商品类型
		term : 2		//排序数据term值为2--->以人气（开奖次数最多）顺序排序,term值为3--->最新商品,term值为4--->以剩余人次排列，term值为5--->以总需人次升序排列,term值为6-->以总需人次降序排列）
  },
  computed:{
  	noDataShow:function(){  		
  		return this.items!=null&&this.items.length==0;
  	}
  }
});

//从后台获取商品分类数据
//function getTypes(){
//	$.ajax({
//		url:gb.ajaxUrl+'r=shop/classify',
//		dataType: 'jsonp',
//		cache:true,
//		success: function(data){
//	//		var str = '';
//	//		for(var i = 0,l = msg.data.length ; i < l ; i++){
//	//			str += '<li '+(i==0?'class="on"':'')+'value="' + msg.data[i].name + '">' + msg.data[i].name + '</li>';
//	//		}		
//	//		$('#types').html(str);
//			VMTypes.items = data.data;
//			getGoods(VMTypes.defaultId);
//		}
//	});
//}

//根据商品类型和排序规则获取商品列表
function getGoods(){
	//VMGoods.items=[];
	$.ajax({
		url:gb.ajaxUrl+'r=shop/shop-show',	
		dataType: 'jsonp',
		data:{class_id:VMGoods.type,term:VMGoods.term},
		success: function(data){	
			
			if(data.data.length == 0){
				VMGoods.items = [];
//				app.ui.noData({
//					id:'all-goods',
//					mes:'暂时没有相关类别商品'
//				});
			}else{
//				$("#all-goods").html('');
				VMGoods.items = data.data.list;
				//根据购物车已有数据，更新页面显示
				setTimeout(function(){
					function callBack(id){
						$("#"+id).find('.plus').addClass('on');
					}
					app.gwc.showStateOfGoods(VMGoods.items,callBack);
				},10)
			}
		}
	});
}



getGoods();


$('#types').on('tap','li',function(){
	if($(this).attr('id') == 'type0'){
		//search
		setTimeout(function() {
			app.action.href('search.html');	
		},250)
		//延迟跳转解决ios，跳转又返回的问题
	}else{
		$('#types li').removeClass('on');
		$(this).addClass('on');
		VMGoods.type = $(this).attr('id').replace('type','');
		getGoods();
	}
})


var px = {
	name:'',
	type:''
}
//排序逻辑
$('#sortNav').on('tap','span',function(){
	//UI
	if($(this).is('.on')){
		if(px.name == 'zx'){			
			if($(this).is('.top')){
				$(this).removeClass('top').addClass('down');
			}else{
				$(this).removeClass('down').addClass('top');
			}
		}else{
			return;
		}
	}else{
		$('#sortNav span').removeClass('on');		
		if(this.id == 'zx'){
			$(this).addClass('on top');
		}else{
			$(this).addClass('on');
		}
	}
	//更新排序数据
	var el = $('#sortNav .on');
	px.name = el.attr('id');
	if(el.is('.top')){
		px.type = 'top';
	}else if(el.is('.down')){
		px.type = 'down';
	}
	//将排序对象转换为参数
	if(px.name == 'hot'){
		VMGoods.term = '2';
	}else if(px.name == 'new'){
		VMGoods.term = '3';
	}else if(px.name == 'sy'){
		VMGoods.term = '4';
	}else if(px.name == 'zx'){
		if(px.type == 'top'){
			VMGoods.term = '5';
		}else{
			VMGoods.term = '6';
		}
	}
	console.log(VMGoods.term);
	getGoods();
})

//点击加入购物车按钮
//$('#all-goods').on('tap', '.plus', function() {
//	//商品列表样式修改	
//	if($(this).is('.on')) {
//		function deleteEventCB(){
//			$(this).removeClass('on');
//		}
//		app.gwc.deleteEvent.apply(this,[$(this).parent().attr('id'),deleteEventCB]);
//	} else {
//		console.log('pps');
//		function addEventCB(){
//			$(this).addClass('on');
//		}
//		app.gwc.addEvent.apply(this,[$(this).parent(),VMGoods.items,addEventCB]);
//	};
//});

$('#all-goods').on('tap', '.good-item', function(e){
	if($(e.target).is('.plus')){//点击加入购物车
		var _this = $(e.target);
		//商品列表样式修改
		if(_this.is('.on')) {
			function deleteEventCB(){
				_this.removeClass('on');
			}
			app.gwc.deleteEvent.apply(this,[_this.parent().attr('id'),deleteEventCB]);
		} else {
			console.log('pps');
			function addEventCB(){
				_this.addClass('on');
			}
			app.gwc.addEvent.apply(this,[_this.parent(),VMGoods.items,addEventCB]);
		};
	}else{//点击跳转商品详情
		window.location.href='goods_details.html?periods=' + encodeURI($(this).attr('periods'));
	}
})

//$('#all-goods').swipeLeft(function(e){
//	confirm(2);
//	e.preventDefault();
//})
