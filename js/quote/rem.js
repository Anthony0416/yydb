(function(){
        var t;
        function initHtmlFont(){
          var maxWidth = 750;
          var windowWidth = window.innerWidth||document.body.clientWidth;
          windowWidth = (windowWidth>maxWidth?maxWidth:windowWidth);  
          //手机横屏
          if(window.innerWidth>window.innerHeight){
          	windowWidth = windowWidth/2;          
          }   
          document.documentElement.style.fontSize = 100*(windowWidth/375)+'px';   
        }
        
        function reSizeHtmlFont(){
          //clearInterval(t);
          setTimeout(function(){
            initHtmlFont();
          },250)          
        }
		window.reSizeHtmlFont = reSizeHtmlFont;
        initHtmlFont();
      })()