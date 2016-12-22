//判断微信登录和app登录
var system = null;

//购买分享的订单id
var trade_id;

var data = app.gwc.getData();
var len = app.gwc.getDataLength(data);
var goodsData = []; //购买数据准备
var userGrade = app.user.getUserInfo();
if(userGrade){
	userGrade = userGrade.grade || 0;
}
var zhekou = [100,99,98,97];

function noData(){
	app.ui.noData({
		id:'goodsList',
		mes:'购物车还是空的'
	});
	$('body').removeClass('has-footer-bar');
}

if(len){
	var str = '';
	for(var i in data){
		var d = data[i];
		var goodPriceClass = ' good-region-'+d.region;
		str += '<div id='+ d.id +' class="m_cart_items'+goodPriceClass+'">'
				+'	<div class="m_cart_pic">'
				+'		<img src="'+ d.img +'"/>'
				+'	</div>'
				+'	<div class="m_cart_text" data-residue='+ d.residue_people +' data-cur-num='+ (d.num||1)+'>'
				+'		<p class="m_cart_title test-ellipsis">'+ d.name +'</p>'
				+'        <p class="m_cart_explain">总需'+ d.total_people +'人次，剩余<span class="red">'+ d.residue_people +'</span>人次</p>'
				+		component.numInput 
				+'		<a class="iconfont beixuan">&#xe60f;</a>'
				+'		<i class="iconfont red plus">&#xe602;</i>'
				+'	</div>'		
				+'  <div class="mask"><a>5</a><a>10</a><a>20</a><a>50</a><a>100</a><a>包尾</a></div>'
				+'</div>';
	}
	
	$('#goodsList').html(str);
	setTimeout(function(){
		$(".m_cart_items").find('input').each(function(){
			var parent = $(this).parent().parent();			
			$(this).NumInput({
		      max : Number(parent.attr('data-residue')),
		      val : Number(parent.attr('data-cur-num')),
		      fn  : function(){
		      	console.log(this.ts.value);		      		 
		        app.gwc.upDataGood(parent.parent().attr('id'),{
		      		num:this.ts.value
		      	});
		        upDataUI();
		      }
		    });
		})
		upDataUI();
	},10)	
}else{
	noData();	
}

//delete
$('#goodsList').on('tap','.plus',function(){
	var elItem = $(this).parent().parent();
	app.gwc.deleteGood(elItem.attr('id'));
	elItem.animate({
				"-webkit-transform": 'translateX(-' + elItem.width() + 'px) '
			}, 800, 'cubic-bezier(.23,.59,.06,.93)', function() {
				$(this).remove();
				if($('.m_cart_items').length == 0){
					noData();
				}
			})		
	upDataUI();
}).on('tap','.beixuan',function(){
	var elItem = $(this).parent().parent();
	elItem.find('.mask').css('height','100%');
})

$('.mask').on('tap','a',function(e){
	var value = $(this).text();
	var elItem = $(this).parent().parent().find('.m_cart_text');
	var residue = Number(elItem.attr('data-residue'));
	if(value == '包尾'){
		value = residue;
	}else{
		value = Number(value);
		if(value > residue){
			value = residue;
		}
	}
	elItem.find('input').val(value);
	app.gwc.upDataGood(elItem.parent().attr('id'),{
  		num:value
  	});
	upDataUI();
	$(this).parent().css('height','0');
	e.stopPropagation();
}).on('tap',function(){
	$(this).css('height','0');
})


//界面更新
function upDataUI(){
	//更新本地数据
	var d = app.gwc.getData();
	goodsData = [];
	for(var i in d){
		var _d = d[i];
		var obj = {
			id:_d.id,
			region:_d.region,
			num:_d.num||1,
			price:_d.price
		}
		goodsData.push(obj);
	}
	//重新渲染
	function showUI(){
		var num = 0;
		var pay = 0;
		for(var i in goodsData){
			var _d = goodsData[i];
			console.log(_d);
			num++;
			var every_price = 1;
			if(_d.region == 2){
				every_price = 10;
			}else if(_d.region == 3){
				every_price = 100;
			}else if(_d.region == 4){
				every_price = _d.price/2;
			}
			pay += Number(_d.num)*every_price*10;
		}
		$("#goodsNumber").text(num);
		$("#goodsPay").text(pay * zhekou[userGrade]/100+'夺宝币');
		
		var str = ''
		
		if(userGrade > 0){
			str = '<p id="bar" money="'+pay+'">'
				+	'共<span id="goodsNumber">'+num+'</span>件宝物，原<span id="goodsPay" class="red">'+pay+'夺宝币</span>'
				+ '</p>'
				+ '<p id="vip">V'+userGrade+'用户专享'+zhekou[userGrade]+'折，现<span class="red">'+ pay * zhekou[userGrade]/100+'夺宝币</span></p>';
			$(".total").addClass('vip');			
		}else{
			str = '<p id="bar" money="'+pay+'">'
				+	'共<span id="goodsNumber">'+num+'</span>件宝物，合计<span id="goodsPay" class="red">'+pay+'夺宝币</span>'
				+ '</p>'
		}
		$(".total").html(str);
	}
	showUI();
}

//pay
//{purchase:[{"product_id":1,"periods":"1091310016","time":5}}
$(".btn").on('tap',function(){
	
	var user = app.user.getUserInfo();
	if(!user){
		app.action.href('login.html?redirectUrl=buyCar.html');
		return;
	}
	
	//判断金额是否足够
	if(Number(user.balance) < Number($("#bar").attr('money'))){
		$.dialog({
	        content : '夺宝币不足，请充值',
	        title: "alert",
	        okText : '前往充值',
	        ok : function() {
            	app.action.href('recharge.html');
	        },
	        cancelText : '取消',
	        cancel : function() {
	            
	        }
    	});
    	return;
	}
	
	var dialog = $.dialog({
        content : '正在购买...',
        title: "load"
	});
	
	//组织购买数据
	var data = {
		purchase:[],
		system:system
	};
	var gwc = app.gwc.getData();
	for(var i in gwc){
		if(typeof(gwc[i]) == 'object'){
			var time = gwc[i].num||1;
			var every_price = 1;
			if(gwc[i].region == 2){
				every_price = 10;
			}else if(gwc[i].region == 3){
				every_price = 100;
			}else if(gwc[i].region == 4){
				every_price = gwc[i].price/2;
			}
			var money = time * every_price  * 10 * zhekou[userGrade]/100;
			var o = {
				product_id:gwc[i].id,
				periods:gwc[i].periods,
				time:time,
				money:money
			};			
			data.purchase.push(o);
		}
	}
	
	if(data.purchase.length == 0){
		$.dialog({
	        content : '购物车商品已过期',
	        title: "alert",
	        okText : '确定',
	        ok : function() {
            	location.reload();
	        },
    	});
    	return;
	}
	
	$.ajax({
		dataType: 'jsonp',
		url:gb.ajaxUrl+'r=shop/purchase',
		data: data,
		success: function(d){
			console.log(d)
			trade_id = d.trade_id;
			dialog.close();
			if(d.code == '0'){
				app.gwc.deleteAll();
				upDataUI();
				$('#shareBg').show();
//				$.dialog({
//			        content : '购买成功，坐等宝贝',
//			        title: "ok",
//			        okText : '查看记录',
//			        ok : function() {
//		            	app.action.href('buy_records.html');
//			        },
//			        cancelText : '继续夺宝',
//			        cancel : function() {
//			            app.action.href('../index.html');
//			        }
//		    	});
			}else{
				$.dialog({
			        content : d.msg,
			        title: "alert",
			        time : 2000
		    	});
			}
		}
	})
})

//购买后弹层的事件
$('#shareBg').tap(function() {
	var _this = $(this);
	setTimeout(function() {
		_this.hide();
		$('#guide').hide();
	},300)
})

$('.review').tap(function() {
	app.action.href('buy_records.html');
	return false;
})

//判断是否空对象
function isEmptyObject(e) {
  var t;  
  for (t in e)  
      return 1;  
  return 0;
}

var _buyCar = app.gwc.getData();
var periods;

if(browser.versions.mobile) {
	//判断是否是移动设备打开。browser代码在下面
	var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		//在微信中打开
		system = 1;
		
		$('.share').tap(function() {
			$('#guide').show();
			wx.ready(function() {
				wxPublicShare(trade_id);
			});
			return false;
		})
		
		var wxPublicShare = function(tradeId) {
			wx.onMenuShareAppMessage({
				title: '来和我们一起夺宝吧!', // 分享标题
				desc: '我和小伙伴们在获宝网上一起夺宝!', // 分享描述
				link: 'http://fenliulianglo.com/tiduihulian/share/project/duobao/H5/dist/html/user/sharePage2.html?trade_id=' + tradeId, // 分享链接
				imgUrl: 'http://fenliulianglo.com/tiduihulian/share/project/duobao/H5/dist/img/touxiang/duobao2.jpg', // 分享图标
				type: 'link', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function() {
					// 用户确认分享后执行的回调函数
					$('#shareBg').hide();
					$('#guide').hide();
					window.location.reload();
				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
					alert('取消分享')
				}
			});

			wx.onMenuShareTimeline({
				title: '我和小伙伴们在获宝网上一起夺宝', // 分享标题
				link: 'http://fenliulianglo.com/tiduihulian/share/project/duobao/H5/dist/html/user/sharePage2.html?trade_id=' + tradeId, // 分享链接
				imgUrl: 'http://fenliulianglo.com/tiduihulian/share/project/duobao/H5/dist/img/touxiang/duobao2.jpg', // 分享图标
				success: function() {
					// 用户确认分享后执行的回调函数
					$('#shareBg').hide();
					$('#guide').hide();
					window.location.reload();
				},
				cancel: function() {
					alert('取消分享')
						// 用户取消分享后执行的回调函数
				}
			});
		}
		
		if(isEmptyObject(_buyCar)) {
			for(var i in _buyCar) {
				periods = _buyCar[i].periods;
			}
			//微信分享
			var _appId, _timeStamp, _nonceStr, _signature;
			var _url = window.location.href;
			
			$.ajax({
				type: "get",
				url: gb.ajaxUrl + "r=share/share-info",
				dataType: 'jsonp',
				data: {
					url: _url
				},
				success: function(re) {
					console.log(re)
					var _d = re.data;
					_appId = _d.appId;
					_timeStamp = _d.timestamp;
					_nonceStr = _d.nonceStr;
					_signature = _d.signature;
	
					wx.config({
						debug: false,
						appId: _appId,
						timestamp: _timeStamp,
						nonceStr: _nonceStr,
						signature: _signature,
						jsApiList: [
							// 所有要调用的 API 都要加到这个列表中
							'checkJsApi',
							'openLocation',
							'getLocation',
							'onMenuShareTimeline',
							'onMenuShareAppMessage'
						]
					});
	
					wx.checkJsApi({
						jsApiList: [
							'getLocation',
							'onMenuShareTimeline',
							'onMenuShareAppMessage'
						],
						success: function(res) {
							console.log(res)
						}
					});
				},
				error: function(e) {
					console.log(e)
				}
			});
	
			
			
		}
		
		
		
	} else if(ua.match(/WeiBo/i) == "weibo") {
		//在新浪微博客户端打开
	} else if(ua.match(/QQ/i) == "qq") {
		//在QQ空间打开
	} else if(browser.versions.android || browser.versions.ios) {
		//是否在安卓浏览器打开
		system = 0;
		
		$('.share').tap(function() {
			$('#sharePage').show();
			return false;
		});
		
		
		if(isEmptyObject(_buyCar)) {
			for(var i in _buyCar) {
				periods = _buyCar[i].periods;
			}
			
			//分享
			var share = {
				ok: function() {
					//页面事件
					var shareEvents = {
						//分享微信好友
						weChat: function() {
							$('.weChat').tap(function() {
								plus.nativeUI.showWaiting();
								shareHref({
									'id': "weixin",
									'ex': 'WXSceneSession',
								});
								return false;
							})
						},
						//分享微信朋友圈
						moment: function() {
							$('.moment').tap(function() {
								plus.nativeUI.showWaiting();
								shareHref({
									'id': "weixin",
									'ex': 'WXSceneTimeline',
								});
								return false;
							})
						},
					}

					//分享事件
					var Intent = null,
						File = null,
						Uri = null,
						main = null;
					var shares = null;
					var shareImageUrl = '';
					// H5 plus事件处理
					function plusReady() {
						setTimeout(function() {
							updateSerivces()
						}, 600)
						if(plus.os.name == "Android") {
							Intent = plus.android.importClass("android.content.Intent");
							File = plus.android.importClass("java.io.File");
							Uri = plus.android.importClass("android.net.Uri");
							main = plus.android.runtimeMainActivity();
						}
					}
					if(window.plus) {
						plusReady();
					} else {
						document.addEventListener("plusready", plusReady, false);
					}
					/**
					 * 更新分享服务
					 */
					function updateSerivces() {
						plus.share.getServices(function(s) {
							console.log(s)
							shares = {};
							for(var i in s) {
								var t = s[i];
								shares[t.id] = t;
							}
							//       tip("获取分享服务列表成功");
						}, function(e) {
//									tip("获取分享服务列表失败：" + e.message);
						});
					}

					/**
					 * 分享操作
					 */
					function shareAction(id, ex) {
						var s = null;
						if(!id || !(s = shares[id])) {
							//         tip("无效的分享服务！");
							return;
						}
						if(s.authenticated) {
							//         tip("---已授权---");
							shareMessage(s, ex);
						} else {
							//         tip("---未授权---");
							s.authorize(function() {
								shareMessage(s, ex);
							}, function(e) {
								//           tip("认证授权失败");
							});
						}
					}

					/**
					 * 发送分享消息
					 */
					function shareMessage(s, ex) {

						var msg = {
							href: 'http://fenliulianglo.com/tiduihulian/share/project/duobao/H5/dist/html/user/sharePage2.html?trade_id=' + trade_id,
							title: '我和小伙伴们在获宝网上一起夺宝！',
							content: '来和我们一起夺宝吧！',
							thumbs: ['http://fenliulianglo.com/tiduihulian/share/project/duobao/H5/dist/img/touxiang/duobao2.jpg'],
							pictures: ['http://fenliulianglo.com/tiduihulian/share/project/duobao/H5/dist/img/touxiang/duobao2.jpg'],
							extra: {
								scene: ex
							}
						};

						s.send(msg, function() {
							
							$('#sharePage').hide();
							setTimeout(function() {
								$('#shareBg').hide();
							},10)
							plus.nativeUI.toast('已分享');
							window.location.reload();
							plus.nativeUI.closeWaiting();
						}, function(e) {
							//							tip("分享失败!");
						});
					}
					/**
					 * 分享按钮点击事件
					 */
					function shareHref(opts) {
						var ids = opts;
						shareAction(ids.id, ids.ex)
					}


					shareEvents.moment();
					shareEvents.weChat();
				}
			}
			share.ok();
		}
		
		$('#cancel').tap(function() {
			$('#sharePage').hide();
			return false;
		})
	}
} else {
	//否则就是PC浏览器打开
}
