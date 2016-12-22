/*!
 * vconsole v1.3.0 (https://github.com/WechatFE/vConsole)
 * Copyright 2016, WechatFE Team
 * MIT license
 */
//!function(o,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.vConsole=t():o.vConsole=t()}(this,function(){return function(o){function t(n){if(e[n])return e[n].exports;var i=e[n]={exports:{},id:n,loaded:!1};return o[n].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var e={};return t.m=o,t.c=e,t.p="",t(0)}([function(o,t,e){"use strict";function n(o){return o&&o.__esModule?o:{"default":o}}function i(){var o=this;this.html=k["default"],this.$dom=null,this.activedTab="default",this.tabList=["default","system","network"],this.console={},this.logList=[],this.isReady=!1,this.switchPos={x:10,y:10,startX:0,startY:0,endX:0,endY:0},o._mokeConsole(),o._mokeAjax();var t=function(){o._render(),o._bindEvent(),o._autoRun()};"complete"==document.readyState?t():d(window,"load",t)}function r(o,t){return t?t.querySelector(o):document.querySelector(o)}function c(o,t){var e,n=[];return e=t?t.querySelectorAll(o):document.querySelectorAll(o),e&&e.length>0&&(n=Array.prototype.slice.call(e)),n}function s(o,t){if(o){h(o)||(o=[o]);for(var e=0;e<o.length;e++)o[e].className+=" "+t}}function l(o,t){if(o){h(o)||(o=[o]);for(var e=0;e<o.length;e++){for(var n=o[e].className.split(" "),i=0;i<n.length;i++)n[i]==t&&(n[i]="");o[e].className=n.join(" ")}}}function a(o,t){if(!o)return!1;for(var e=o.className.split(" "),n=0;n<e.length;n++)if(e[n]==t)return!0;return!1}function d(o,t,e,n){if(o){void 0===n&&(n=!1),h(o)||(o=[o]);for(var i=0;i<o.length;i++)o[i].addEventListener(t,e,n)}}function v(o){var t=o>0?new Date(o):new Date,e=t.getDay()<10?"0"+t.getDay():t.getDay(),n=t.getMonth()<9?"0"+(t.getMonth()+1):t.getMonth()+1,i=t.getFullYear(),r=t.getHours()<10?"0"+t.getHours():t.getHours(),c=t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes(),s=t.getSeconds()<10?"0"+t.getSeconds():t.getSeconds(),l=t.getMilliseconds()<10?"0"+t.getMilliseconds():t.getMilliseconds();return 100>l&&(l="0"+l),{time:+t,year:i,month:n,day:e,hour:r,minute:c,second:s,millisecond:l}}function f(o){return document.createElement("a").appendChild(document.createTextNode(o)).parentNode.innerHTML}function p(o,t){var e=o;for(var n in t)e=e.replace("{"+n+"}",t[n]);return e}function u(o){return"[object Number]"==Object.prototype.toString.call(o)}function g(o){return"[object String]"==Object.prototype.toString.call(o)}function h(o){return"[object Array]"==Object.prototype.toString.call(o)}function b(o){return"[object Object]"==Object.prototype.toString.call(o)}function m(o){return"[object Function]"==Object.prototype.toString.call(o)}function _(o,t){o="vConsole_"+o,localStorage.setItem(o,t)}function y(o){return o="vConsole_"+o,localStorage.getItem(o)}Object.defineProperty(t,"__esModule",{value:!0});var w="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol?"symbol":typeof o};e(1);var x=e(5),k=n(x),L=e(6),S=n(L);i.prototype._render=function(){var o="#__vconsole";if(!r(o)){var t=document.createElement("div");t.innerHTML=this.html,document.body.appendChild(t.children[0])}this.$dom=r(o);var e=y("switch_x"),n=y("switch_y");e&&n&&(this.switchPos.x=e,this.switchPos.y=n,r(".vc-switch").style.right=e+"px",r(".vc-switch").style.bottom=n+"px")},i.prototype._bindEvent=function(){var o=this,t=r(".vc-switch");d(t,"touchstart",function(t){o.switchPos.startX=t.touches[0].pageX,o.switchPos.startY=t.touches[0].pageY}),d(t,"touchend",function(t){0==o.switchPos.endX&&0==o.switchPos.endY||(o.switchPos.x=o.switchPos.endX,o.switchPos.y=o.switchPos.endY,o.switchPos.startX=0,o.switchPos.startY=0,o.switchPos.endX=0,o.switchPos.endY=0,_("switch_x",o.switchPos.x),_("switch_y",o.switchPos.y))}),d(t,"touchmove",function(e){if(e.touches.length>0){var n=e.touches[0].pageX-o.switchPos.startX,i=e.touches[0].pageY-o.switchPos.startY,r=o.switchPos.x-n,c=o.switchPos.y-i;t.style.right=r+"px",t.style.bottom=c+"px",o.switchPos.endX=r,o.switchPos.endY=c,e.preventDefault()}}),d(r(".vc-switch"),"click",function(){o.show()}),d(r(".vc-hide"),"click",function(){o.hide()}),d(r(".vc-mask"),"click",function(t){return t.target!=r(".vc-mask")?!1:void o.hide()}),d(r(".vc-clear"),"click",function(){o.clearLog(o.activedTab)}),d(c(".vc-tab"),"click",function(t){var e=t.target.dataset.tab;e!=o.activedTab&&o.showTab(e)}),d(c(".vc-log"),"click",function(o){var t=o.target;a(t,"vc-fold-outer")&&(a(t.parentElement,"vc-toggle")?l(t.parentElement,"vc-toggle"):s(t.parentElement,"vc-toggle"),o.preventDefault())})},i.prototype._mokeConsole=function(){if(window.console){var o=this;this.console.log=window.console.log,this.console.info=window.console.info,this.console.warn=window.console.warn,this.console.debug=window.console.debug,this.console.error=window.console.error,window.console.log=function(){o._printLog("auto","log",arguments)},window.console.info=function(){o._printLog("auto","info",arguments)},window.console.warn=function(){o._printLog("auto","warn",arguments)},window.console.debug=function(){o._printLog("auto","debug",arguments)},window.console.error=function(){o._printLog("auto","error",arguments)},window.onerror=function(o,t,e,n,i){var r=i.stack.split("at");r=r[0]+" "+r[1],r=r.replace(location.origin,""),console.error(r)}}},i.prototype._mokeAjax=function(){var o=window.XMLHttpRequest;if(o){var t=window.XMLHttpRequest.prototype.open,e=window.XMLHttpRequest.prototype.send;window.XMLHttpRequest.prototype.open=function(){var o=this,e=arguments;return setTimeout(function(){var t=o.onreadystatechange||function(){};o.onreadystatechange=function(){if(4==o.readyState){o._endTime=+new Date;var n=e[1]||"unknow URL",i=o._endTime-(o._startTime||o._endTime),r="[network]["+o.status+"] ["+i+"ms] "+n;o.status>=200&&o.status<400?console.log(r):console.error(r)}return t.apply(o,arguments)}},0),t.apply(o,e)},window.XMLHttpRequest.prototype.send=function(){var o=this,t=arguments;o._startTime=+new Date,setTimeout(function(){e.apply(o,t)},1)}}},i.prototype._autoRun=function(){for(this.isReady=!0;this.logList.length>0;){var o=this.logList.shift();this._printLog(o.tabName,o.logType,o.logs)}var t=navigator.userAgent,e=[],n=v();this._printLog("system","info",["日志时间:",n.year+"-"+n.month+"-"+n.day+" "+n.hour+":"+n.minute+":"+n.second+" "+n.millisecond]),e=["系统版本:","不明"];var i=t.match(/(ipod).*\s([\d_]+)/i),r=t.match(/(ipad).*\s([\d_]+)/i),c=t.match(/(iphone)\sos\s([\d_]+)/i),s=t.match(/(android)\s([\d\.]+)/i);s?e[1]="Android "+s[2]:c?e[1]="iPhone, iOS "+c[2].replace(/_/g,"."):r?e[1]="iPad, iOS "+r[2].replace(/_/g,"."):i&&(e[1]="iPod, iOS "+i[2].replace(/_/g,".")),this._printLog("system","info",e);var l=t.match(/MicroMessenger\/([\d\.]+)/i);e=["微信版本:","不明"],l&&l[1]&&(e[1]=l[1],this._printLog("system","info",e));var a=t.toLowerCase().match(/ nettype\/([^ ]+)/g);e=["网络类型:","不明"],a&&a[0]&&(a=a[0].split("/"),e[1]=a[1],this._printLog("system","info",e)),e=["网址协议:","不明"],"https:"==location.protocol?e[1]="HTTPS":"http:"==location.protocol?e[1]="HTTP":e[1]=location.protocol.replace(":",""),this._printLog("system","info",e),window.addEventListener("load",function(o){var t=window.performance||window.msPerformance||window.webkitPerformance;if(t&&t.timing){var e=t.timing,n=e.navigationStart;this._printLog("system","info",["连接结束点:",e.connectEnd-n+"ms"]),this._printLog("system","info",["回包结束点:",e.responseEnd-n+"ms"]),e.secureConnectionStart>0&&this._printLog("system","info",["ssl耗时:",e.connectEnd-e.secureConnectionStart+"ms"]),this._printLog("system","info",["dom渲染耗时:",e.domComplete-e.domLoading+"ms"])}})},i.prototype._printLog=function(o,t,e){if(e.length){if(!this.isReady)return void this.logList.push({tabName:o,logType:t,logs:e});for(var n="",i=0;i<e.length;i++)try{n+=m(e[i])?" "+e[i].toString():b(e[i])||h(e[i])?" "+this._getFoldedLine(e[i]):" "+f(e[i]).replace(/\n/g,"<br/>")}catch(c){n+=" ["+w(e[i])+"]"}if("auto"==o){var s=/^ \[(\w+)\]/i,l=n.match(s);null!==l&&l.length>0&&this.tabList.indexOf(l[1])>-1&&(o=l[1],n=n.replace(s,""))}"auto"==o&&(o="default");var a=r("#__vc_log_"+o),d=document.createElement("p");d.className="vc-item vc-item-"+t,d.innerHTML=n,r(".vc-log",a).appendChild(d),r(".vc-content").scrollTop=r(".vc-content").scrollHeight,this.console[t].apply(window.console,e)}},i.prototype._getFoldedLine=function(o,t){function e(o){if(b(o)){var t=Object.keys(o);r+="{\n",s++;for(var n=0;n<t.length;n++){var i=t[n];o.hasOwnProperty(i)&&(r+=Array(s+1).join(l)+'<i class="vc-code-key">'+i+"</i>: ",e(o[i]),n<t.length-1&&(r+=",\n"))}s--,r+="\n"+Array(s+1).join(l)+"}"}else if(h(o)){r+="[\n",s++;for(var n=0;n<o.length;n++)r+=Array(s+1).join(l)+'<i class="vc-code-key">'+n+"</i>: ",e(o[n]),n<o.length-1&&(r+=",\n");s--,r+="\n"+Array(s+1).join(l)+"]"}else r+=g(o)?'<i class="vc-code-string">"'+o+'"</i>':u(o)?'<i class="vc-code-number">'+o+"</i>":JSON.stringify(o)}var n=JSON.stringify(o),i="",r="",c="",s=0,l="  ";c=n.substr(0,30),n.length>30&&(c+="..."),i=Object.prototype.toString.call(o).replace("[object ","").replace("]",""),i+=" "+c,e(o);var a=p(S["default"],{outer:i,inner:r});return a},i.prototype.showTab=function(o){var t=r("#__vc_log_"+o);l(c(".vc-tab",this.$dom),"vc-actived"),s(r("#__vc_tab_"+o),"vc-actived"),l(c(".vc-logbox"),"vc-actived"),s(t,"vc-actived"),r(".vc-content").scrollTop=r(".vc-content").scrollHeight,this.activedTab=o},i.prototype.clearLog=function(o){var t=r("#__vc_log_"+o);r(".vc-log",t).innerHTML=""},i.prototype.show=function(){s(this.$dom,"vc-toggle")},i.prototype.hide=function(){l(this.$dom,"vc-toggle")},i.prototype.ready=function(o){console.warn("vConsole.ready() is deprecated, console.log() can be called at anytime without waiting for ready. This method will be removed at v2.0.0 and later"),o&&o.call(this)},t["default"]=new i,o.exports=t["default"]},function(o,t,e){var n=e(2);"string"==typeof n&&(n=[[o.id,n,""]]);e(4)(n,{});n.locals&&(o.exports=n.locals)},function(o,t,e){t=o.exports=e(3)(),t.push([o.id,'#__vconsole{font-size:13px}#__vconsole .vc-switch{display:block;position:fixed;right:10px;bottom:10px;color:#fff;background-color:#04be02;line-height:1;font-size:14px;padding:8px 16px;z-index:10000;border-radius:4px;box-shadow:0 0 8px rgba(0,0,0,.4)}#__vconsole .vc-mask{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background-color:transparent;z-index:10001;transition:background .3s;-webkit-tap-highlight-color:transparent}#__vconsole .vc-panel{position:fixed;min-height:80%;left:0;right:0;bottom:0;z-index:10002;background-color:#efeff4;-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s;-webkit-transform:translateY(100%);transform:translateY(100%)}#__vconsole .vc-tabbar{border-bottom:1px solid #d9d9d9;overflow:hidden}#__vconsole .vc-tabbar .vc-tab{float:left;line-height:39px;padding:0 15px;border-right:1px solid #d9d9d9;text-decoration:none;color:#000;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}#__vconsole .vc-tabbar .vc-tab:active{background-color:rgba(0,0,0,.15)}#__vconsole .vc-tabbar .vc-tab.vc-actived{background-color:#fff}#__vconsole .vc-content{background-color:#fff;overflow-x:hidden;overflow-y:scroll;position:absolute;top:40px;left:0;right:0;bottom:40px;-webkit-overflow-scrolling:touch}#__vconsole .vc-logbox{display:none;position:relative;height:100%}#__vconsole .vc-logbox i{font-style:normal}#__vconsole .vc-logbox .vc-log{-webkit-tap-highlight-color:transparent}#__vconsole .vc-logbox .vc-log:empty:before{content:"No log";color:#999;position:absolute;top:45%;left:0;right:0;bottom:0;font-size:15px;text-align:center}#__vconsole .vc-logbox .vc-item{margin:0;padding:6px 8px;line-height:1.3;border-bottom:1px solid #eee;word-break:break-word}#__vconsole .vc-logbox .vc-item-info{color:#6a5acd}#__vconsole .vc-logbox .vc-item-debug{color:#daa520}#__vconsole .vc-logbox .vc-item-warn{color:orange;border-color:#ffb930;background-color:#fffacd}#__vconsole .vc-logbox .vc-item-error{color:#dc143c;border-color:#f4a0ab;background-color:#ffe4e1}#__vconsole .vc-logbox .vc-item .vc-fold{display:block;max-height:300px;overflow:scroll;-webkit-overflow-scrolling:touch}#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-outer{display:block;font-style:italic}#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-outer:active{background-color:rgba(0,0,0,.15)}#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-outer{padding-left:10px;position:relative}#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-outer:before{content:"";position:absolute;top:4px;left:2px;width:0;height:0;border:4px solid transparent;border-left-color:#000}#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-inner{display:none}#__vconsole .vc-logbox .vc-item .vc-fold.vc-toggle .vc-fold-outer:before{top:6px;left:0;border-top-color:#000;border-left-color:transparent}#__vconsole .vc-logbox .vc-item .vc-fold.vc-toggle .vc-fold-inner{display:block}#__vconsole .vc-logbox .vc-code-key{color:#905}#__vconsole .vc-logbox .vc-code-number{color:#0086b3}#__vconsole .vc-logbox .vc-code-string{color:#183691}#__vconsole .vc-logbox.vc-actived{display:block}#__vconsole .vc-toolbar{border-top:1px solid #d9d9d9;line-height:39px;position:absolute;left:0;right:0;bottom:0;overflow:hidden}#__vconsole .vc-toolbar .vc-tool{text-decoration:none;color:#000;width:50%;float:left;text-align:center;position:relative;-webkit-touch-callout:none}#__vconsole .vc-toolbar .vc-tool:after{content:" ";position:absolute;top:7px;bottom:7px;right:0;border-left:1px solid #d9d9d9}#__vconsole .vc-toolbar .vc-tool-last:after{border:none}#__vconsole.vc-toggle .vc-switch{display:none}#__vconsole.vc-toggle .vc-mask{background:rgba(0,0,0,.6);display:block}#__vconsole.vc-toggle .vc-panel{-webkit-transform:translate(0);transform:translate(0)}',""])},function(o,t){"use strict";o.exports=function(){var o=[];return o.toString=function(){for(var o=[],t=0;t<this.length;t++){var e=this[t];e[2]?o.push("@media "+e[2]+"{"+e[1]+"}"):o.push(e[1])}return o.join("")},o.i=function(t,e){"string"==typeof t&&(t=[[null,t,""]]);for(var n={},i=0;i<this.length;i++){var r=this[i][0];"number"==typeof r&&(n[r]=!0)}for(i=0;i<t.length;i++){var c=t[i];"number"==typeof c[0]&&n[c[0]]||(e&&!c[2]?c[2]=e:e&&(c[2]="("+c[2]+") and ("+e+")"),o.push(c))}},o}},function(o,t,e){function n(o,t){for(var e=0;e<o.length;e++){var n=o[e],i=p[n.id];if(i){i.refs++;for(var r=0;r<i.parts.length;r++)i.parts[r](n.parts[r]);for(;r<n.parts.length;r++)i.parts.push(a(n.parts[r],t))}else{for(var c=[],r=0;r<n.parts.length;r++)c.push(a(n.parts[r],t));p[n.id]={id:n.id,refs:1,parts:c}}}}function i(o){for(var t=[],e={},n=0;n<o.length;n++){var i=o[n],r=i[0],c=i[1],s=i[2],l=i[3],a={css:c,media:s,sourceMap:l};e[r]?e[r].parts.push(a):t.push(e[r]={id:r,parts:[a]})}return t}function r(o,t){var e=h(),n=_[_.length-1];if("top"===o.insertAt)n?n.nextSibling?e.insertBefore(t,n.nextSibling):e.appendChild(t):e.insertBefore(t,e.firstChild),_.push(t);else{if("bottom"!==o.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");e.appendChild(t)}}function c(o){o.parentNode.removeChild(o);var t=_.indexOf(o);t>=0&&_.splice(t,1)}function s(o){var t=document.createElement("style");return t.type="text/css",r(o,t),t}function l(o){var t=document.createElement("link");return t.rel="stylesheet",r(o,t),t}function a(o,t){var e,n,i;if(t.singleton){var r=m++;e=b||(b=s(t)),n=d.bind(null,e,r,!1),i=d.bind(null,e,r,!0)}else o.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(e=l(t),n=f.bind(null,e),i=function(){c(e),e.href&&URL.revokeObjectURL(e.href)}):(e=s(t),n=v.bind(null,e),i=function(){c(e)});return n(o),function(t){if(t){if(t.css===o.css&&t.media===o.media&&t.sourceMap===o.sourceMap)return;n(o=t)}else i()}}function d(o,t,e,n){var i=e?"":n.css;if(o.styleSheet)o.styleSheet.cssText=y(t,i);else{var r=document.createTextNode(i),c=o.childNodes;c[t]&&o.removeChild(c[t]),c.length?o.insertBefore(r,c[t]):o.appendChild(r)}}function v(o,t){var e=t.css,n=t.media;if(n&&o.setAttribute("media",n),o.styleSheet)o.styleSheet.cssText=e;else{for(;o.firstChild;)o.removeChild(o.firstChild);o.appendChild(document.createTextNode(e))}}function f(o,t){var e=t.css,n=t.sourceMap;n&&(e+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */");var i=new Blob([e],{type:"text/css"}),r=o.href;o.href=URL.createObjectURL(i),r&&URL.revokeObjectURL(r)}var p={},u=function(o){var t;return function(){return"undefined"==typeof t&&(t=o.apply(this,arguments)),t}},g=u(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),h=u(function(){return document.head||document.getElementsByTagName("head")[0]}),b=null,m=0,_=[];o.exports=function(o,t){t=t||{},"undefined"==typeof t.singleton&&(t.singleton=g()),"undefined"==typeof t.insertAt&&(t.insertAt="bottom");var e=i(o);return n(e,t),function(o){for(var r=[],c=0;c<e.length;c++){var s=e[c],l=p[s.id];l.refs--,r.push(l)}if(o){var a=i(o);n(a,t)}for(var c=0;c<r.length;c++){var l=r[c];if(0===l.refs){for(var d=0;d<l.parts.length;d++)l.parts[d]();delete p[l.id]}}}};var y=function(){var o=[];return function(t,e){return o[t]=e,o.filter(Boolean).join("\n")}}()},function(o,t){o.exports='<div id=__vconsole class=""> <div class=vc-switch>vConsole</div> <div class=vc-mask> </div> <div class=vc-panel> <div class=vc-tabbar> <a class="vc-tab vc-actived" data-tab=default id=__vc_tab_default>Log</a> <a class=vc-tab data-tab=system id=__vc_tab_system>System</a> <a class=vc-tab data-tab=network id=__vc_tab_network>Network</a> </div> <div class=vc-content> <div class="vc-logbox vc-actived" id=__vc_log_default> <div class=vc-log></div> </div> <div class=vc-logbox id=__vc_log_system> <div class=vc-log></div> </div> <div class=vc-logbox id=__vc_log_network> <div class=vc-log></div> </div> </div> <div class=vc-toolbar> <a class="vc-tool vc-clear">Clear</a> <a class="vc-tool vc-tool-last vc-hide">Hide</a> </div> </div> </div>'},function(o,t){o.exports="<span class=vc-fold> <i class=vc-fold-outer>{outer}</i> <pre class=vc-fold-inner>{inner}</pre> </span>"}])});