//apiready = function() {
//	api.setStatusBarStyle({
//		style: 'dark',
//		color: '#6ab494'
//	});
//
//	backButton();
//}
//
////四个导航栏页面，设置新的back事件
//function backButton() {
//
//	//安卓应用
//	var isAndroid = (/android/gi).test(navigator.appVersion);
//	if(isAndroid) {
//		exitApp();
//	} else {
//		//苹果应用	
//		api.addEventListener({
//			name: 'keyback'
//		}, function(ret, err) {
//			api.closeWidget({
//				silent: true
//			});
//		});
//	}
//
//	function exitApp() {
//		api.addEventListener({
//			name: 'keyback'
//		}, function(ret, err) {
//			api.toast({
//				msg: '再按一次返回键退出',
//				duration: 1000,
//				location: 'bottom'
//			});
//
//			api.addEventListener({
//				name: 'keyback'
//			}, function(ret, err) {
//				api.closeWidget({
//					silent: true
//				});
//			});
//
//			setTimeout(function() {
//				exitApp();
//			}, 1000)
//		});
//	}
//
//}

//DCloud后退键处理
// H5 plus事件处理
//function plusReady() {
//	var first = null;
//	plus.key.addEventListener("backbutton", function() {
//		if(!first) {
//			first = new Date().getTime();
//			plus.nativeUI.toast('再按一次退出应用');
//			setTimeout(function() {
//				first = null;
//			}, 1000);
//		} else {
//			if(new Date().getTime() - first < 1000) {
//				plus.runtime.quit();
//			}
//		}
//	});
//}
//if(window.plus) {
//	plusReady();
//} else {
//	document.addEventListener("plusready", plusReady, false);
//}