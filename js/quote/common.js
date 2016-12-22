//active生效
document.addEventListener('DOMContentLoaded', function() {
	document.body.addEventListener('touchstart', function() {});
})

//存储组件数据
var component = {};
//全局对象
var gb = {
	ajaxUrl: 'http://fenliulianglo.com/tiduihulian/share/project/oneshop/houtai/php/frontend/web/index.php?',
	getServerTime: function() {
		var _ts = gb.storage.get('serverTime');
		if(!_ts) {
			$.ajax({
				url: 'http://f.apiplus.cn/time.json',
				dataType: 'jsonp',
				async: false,
				success: function(data) {
					var t = data.nowstamp;
					//console.log(t);
					_ts = new Date().getTime() - t;
					gb.storage.set('serverTime', _ts);
				}
			})
		}
		return new Date().getTime() - _ts;
	},
	storage: {
		/*
		 * @key  [String] Storage 键名
		 * @data [Object|String] Storage 键值
		 * @type [Boolean] 是否是sessionStorage
		 * @time [Number] 存储时间单位S：60*60*24 为一天，不传则永久保存
		 */
		set: function(key, data, type, time) {
			var s = type ? sessionStorage : localStorage;
			if(typeof(data) == 'object') {
				if(time) {
					data._SAVETIME = new Date().getTime() + time * 1000;
				}
				s.setItem(key, JSON.stringify(data));
			} else {
				if(time) {
					data += '&_SAVETIME=' + (new Date().getTime() + time * 1000);
				}
				s.setItem(key, data);
			}
		},
		get: function(key, type) {
			var s = type ? sessionStorage : localStorage;
			var result = s.getItem(key);
			try {
				result = JSON.parse(result);
				if(result._SAVETIME) {
					if(result._SAVETIME > new Date().getTime()) {
						delete result._SAVETIME;
						return result;
					} else {
						gb.storage.delete(key);
						return '';
					}
				} else {
					return result;
				}
			} catch(e) {
				var saveTime = gb.url.getParam('_SAVETIME', result);
				if(saveTime) {
					if(saveTime > new Date().getTime()) {
						return result.replace(/&_SAVETIME\S+/, '');
					} else {
						gb.storage.delete(key);
						return '';
					}
				} else {
					return result;
				}
			}
		},
		delete: function(key, type) {
			var s = type ? sessionStorage : localStorage;
			s.removeItem(key);
		}
	},
	url: {
		getParam: function(name, url) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var from = url || window.location.search.substr(1);
			var r = from.match(reg);
			if(r != null) return(r[2]);
			return '';
		}
	},
	cookie: {
		get: function(name) {
			var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
			if(arr = document.cookie.match(reg))
				return unescape(arr[2]);
			else
				return null;
		},
		set: function(name, value) {
			var Days = 30;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
			document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
		},
		delete: function(name) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval = getCookie(name);
			if(cval != null)
				document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
		}
	}
};

(function() {
	var PHPSESSID = gb.storage.get('PHPSESSID');
	if(PHPSESSID) {
		gb.ajaxUrl += ('PHPSESSID=' + PHPSESSID + '&');
	}
})()

//业务逻辑通用代码
var app = {
	//购物车
	gwc: {
		getData: function() {
			return gb.storage.get('gwc');
		},
		getDataLength: function(d) {
			var data = d || app.gwc.getData();
			if(data) {
				var l = Object.getOwnPropertyNames(data).length;
				if(data._SAVETIME) {
					return l - 1;
				} else {
					return l;
				}
			} else {
				return 0;
			}
		},
		/*
		 * 前端直接调用的加入购物车事件(需要有动画效果)
		 * @itemElement 标有商品id的父元素容器
		 * @goodsData [Array] 有当前商品数据的商品数据集合
		 * @cb 回调函数，执行其它和业务逻辑无关的事情，比如UI更新等
		 */
		addEvent: function(itemElement, goodsData, cb) {
			//购物车动画
			var target = itemElement.find('img');
			var clone = target.clone();
			clone.addClass('pre-anim').css({
				left: target.offset().left,
				top: target.offset().top,
				width: target.width() - 4
			})
			$('body').append(clone);
			setTimeout(function() {
				var x = $('.footer').width() / 2 - target.offset().left;
				var y = $('.footer').offset().top - target.offset().top + target.height() / 4;
				clone.animate({
					"-webkit-transform": 'translate(' + x + 'px,' + y + 'px) scale(0)'
				}, 600, 'linear', function() {
					$(this).remove();
				})
			}, 10);

			//数据操作			
			var id = itemElement.attr('id');
			for(var i in goodsData) {
				if(goodsData[i].id == id) {
					app.gwc.addGood(goodsData[i]);
				}
			}

			//cb
			cb && cb.apply(this);
		},
		/*
		 * 前端直接调用的从购物车删除事件
		 * @id 删除的商品id
		 *  @cb 回调函数，执行其它和业务逻辑无关的事情，比如UI更新等
		 */
		deleteEvent: function(id, cb) {
			app.gwc.deleteGood(id);
			cb && cb.apply(this);
		},
		addGood: function(obj) {
			var data = gb.storage.get('gwc');
			if(data) {
				if(data[obj.id]) {
					app.gwc.setNum(app.gwc.getDataLength(data));
				} else {
					add();
				}
			} else {
				data = {};
				add();
			}

			function add() {
				data[obj.id] = obj;
				gb.storage.set('gwc', data, false, 60 * 60 * 1); //购物车数据本地保存一小时
				console.log(app.gwc.getDataLength(data));
				app.gwc.setNum(app.gwc.getDataLength(data));
			}
		},
		deleteGood: function(id) {
			var data = gb.storage.get('gwc');
			if(data && data[id]) {
				delete data[id];
				gb.storage.set('gwc', data);
				this.setNum(app.gwc.getDataLength(data));
			}
		},
		deleteAll: function() {
			gb.storage.delete('gwc');
		},
		//修改某一商品的信息，比如购买份数
		upDataGood: function(id, obj) {
			var data = gb.storage.get('gwc');
			if(data && data[id]) {
				data[id] = $.extend(data[id], obj)
				gb.storage.set('gwc', data);
			}
		},
		//界面更新购物车商品数量
		setNum: function(num) {
			var el = $('.gwc-tip');
			if(el.length) {
				if(num == 0) {
					el.hide();
					return;
				}
				el.show().text(num);
			}
		},
		//根据购物车数据对界面中的商品列表做样式改变
		showStateOfGoods: function(data, cb) {
			var d = app.gwc.getData();
			if(d && app.gwc.getDataLength(d) > 0) {
				var ids = Object.keys(d);
				for(var i in data) {
					if(ids.indexOf(data[i].id + '') != -1) {
						cb(data[i].id);
					}
				}
			}
		}
	},

	//ui相关
	ui: {
		//列表没有数据
		noData: function(opt) {
			var _opt = {
				id: 'dataList',
				mes: '没有相关数据'
			}
			opt = $.extend(_opt, opt);
			$("#" + opt.id).addClass('no-data').html('<i class="iconfont icon-50-copy"></i><p>' + opt.mes + '</p>');
		},
		//动画相关
		anim: {
			timeFun1: 'cubic-bezier(.1,.56,.07,.98)'
		}
	},

	//行为相关
	action: {
		href: function(url) {
			if(url == '-1') {
				confirm(111);
				history.go(-1);
			} else {
				window.location.href = url;
			}

		}
	},

	//user
	user: {
		setUserInfo: function(data) {
			gb.storage.set('user', data);
		},
		//在原有信息之上增加用户信息
		addUserInfo: function(data) {
			var _data = app.user.getUserInfo();
			if(_data) {
				data = $.extend(_data, data);
			}
			app.user.setUserInfo(data);
		},
		getUserInfo: function() {
			return gb.storage.get('user');
		},
		ajaxUserInfo: function(cb) {
			$.ajax({
				url: gb.ajaxUrl + "r=user/index",
				dataType: 'jsonp',
				success: function(data) {
					cb && cb(data);
				}
			})
		},
		loginOut: function(opt) {
			$.ajax({
				dataType: 'jsonp',
				url: gb.ajaxUrl + 'r=user/logout',
				success: function(e) {
					if(e.code == '0') {
						gb.storage.delete('user');
						gb.storage.delete('PHPSESSID');
						if(opt.redirectUrl) {
							app.action.href(opt.redirectUrl);
						} else if(opt.cb) {
							cb();
						}
					}
				}
			})

		}
	}
};

//处理API的后退事件
var _url = window.location.href;
if(_url.indexOf('index') > -1) {

} else if(_url.indexOf('category') > 1) {

} else if(_url.indexOf('buyCar') > -1) {

} else if(_url.indexOf('person') > -1) {

} else if(_url.indexOf('login') > -1) {

} else {
	var Script = document.createElement('script');
	Script.type = 'text/javascript';
	var _str = 'function plusReady() {\
								plus.key.addEventListener("backbutton", function() {\
									history.back(-1);\
								});\
							};\
							if(window.plus) {\
								plusReady();\
							} else {\
								document.addEventListener("plusready", plusReady, false)\
							}';
	Script.innerHTML = _str;
											
	//延迟增加，则会报错
	setTimeout(function() {
		var first=document.body.firstChild;//得到页面的第一个元素
		document.body.insertBefore(Script,first);//在得到的第一个元素之前插入
	}, 50)
}