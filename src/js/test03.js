// 自动播放的焦点图
(function(){
    var oDiv=$('.swiper-container');
    var slide=oDiv.find('.swiper-slide');
    var pagination=oDiv.find('.swiper-pagination-switch');
//			 	var oP=oDiv.find('p');
//			 	var arr=['爸爸去哪儿啦~','人像摄影中的光影感','娇柔妩媚，美艳大方'];
    var arr=2//轮播总数
    var iNow=0;//初始化从第几个播放
    var timer=null;


    fnFade();
    autoPlay();


    //点击分页切换播放
    pagination.click(function(){
        iNow=$(this).index();
        fnFade();
    });
    //hover停止和启动播放
    oDiv.hover(function(){clearInterval(timer)},autoPlay);
    //间隔播放函数
    function autoPlay(){
        timer=setInterval(function(){
            iNow++;
//			 			iNow%=arr.length;//约瑟夫环
            iNow%=2;
            //console.log(iNow);//1,0,1,0,1,0 约瑟夫环 循环
            fnFade();
        },2000);
    };
    //主逻辑函数
    function fnFade(){
        slide.each(function(i){
            if (i!=iNow) {
                slide.eq(i).fadeOut();
                pagination.eq(i).removeClass('swiper-active-switch');
            } else{
                slide.eq(i).fadeIn();
                pagination.eq(i).addClass('swiper-active-switch');
            };
//			 			oP.text(arr[iNow]);
        })
    }

})();