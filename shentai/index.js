$(function(){

  var $p1= $("#page1"),
    $p2= $("#page2"),
    $p3= $("#page3"),
    $p4= $("#page4"),
    $p5= $("#page5"),
    $p6= $("#page6");

   // var audioSay=createAudio("jd.mp3");
   // var audioRing=createAudio("ring.mp3");
   // var audioMusic2=createAudio("ring.mp3");
   // var audioMusic=createAudio("tun.mp3");

   // var $audioSay=$("#ring");
   var $audioRing=$("#ring");
   // var $audioMusic2=$("#bgmusic");
   // var $audioMusic=$("#bgmusic2");


   // var $audioRing=$("<audio preload loop autoplay src='ring.mp3'></audio>");
   // var $audioSay=$("<audio preload loop src='jd.mp3'></audio>");
   // var $audioMusic=$("<audio preload loop src='tun.mp3'></audio>");
   // var $audioMusic2=$("<audio preload loop src='sh.mp3'></audio>");

   // $("body").append($audioRing);
   // $("body").append($audioSay);
   // $("body").append($audioMusic);
   // $("body").append($audioMusic2);

   var audioRing=$audioRing[0];
   // var audioSay=$audioSay[0];
   // var audioMusic2=$audioMusic2[0];
   // var audioMusic=$audioMusic[0];

   // var audioSay;
   // var audioMusic2;
   // var audioMusic;

  function createAudio(scr){
    var a=new Audio(scr);
    a.loop = true;
    return a;
  }
  $audioRing.on("canplay",function() {
    // alert("ok");
  });
  /*
  p2
   */
  $p2.click(function(event) {
    audioRing.play();
  });
  var p2={
    init:function(){
      $p1.hide();
      $p2.show();
      audioRing.play();

      // var $audioSay=$("<audio preload loop src='jd.mp3'></audio>");
      // $("body").append($audioSay);
      // audioSay=$audioSay[0];

    },
  };
  (function(){
    //处理对象&初始变量
    $p2.show();
    var float_obj = document.getElementById('lock'),
     float_cur = document.getElementById("slider"),
      float_text=$('#lock').find("span"),
      curWidth =float_obj.offsetWidth-float_cur.offsetWidth,
      eventMaxWidth =float_obj.offsetWidth,
      eventOff,startX,clientX;

    $p2.hide();
    //按下鼠标&触点
    function clearStart(event){
      // if(/ui-slider-handle/.test(event.target)){
        //滑动激活
        eventOff = true;
        //恢复初始className
        // float_cur.className = float_cur_startClass;
        //获取鼠标||触点水平坐标
        var touch = event.touches && event.touches[0] || event;
        //记录初始坐标
        startX = touch.clientX;
        //阻止对象默认行为
        event.preventDefault();
        //console.log("开始解锁");
      // }
    }
    //移动鼠标&触点
    function clearMove(event){
      var touch = event.touches && event.touches[0] || event,
        _x = touch.clientX - startX;
        // console.log(startX+"--"+touch.clientX+"--"+curWidth);
      if(eventOff && startX < touch.clientX && _x <= curWidth){
        if(clientX>=25){
          float_text.hide();
        }else{
          float_text.show();
        }
        clientX = parseInt(_x/eventMaxWidth * 100);
        float_cur.style.marginLeft = clientX + "%";
        // console.log("解锁进度：" + clientX + "%");
      }
    }
    //释放鼠标&触点
    function clearEnd(event){
      //滑动激活，且解锁百分比达到50
      if(eventOff && clientX >= 50){
        float_obj.style.opacity = "0";
        float_obj.style.bottom = "-80px";
        eventOff = false;

        p3.init();
        //console.log("解锁完成");
        return false;
      }
      else if(eventOff){
        // float_cur.className += " ui-slider-handle-snapping";
        float_cur.style.marginLeft = "0";
        eventOff = false;
        float_text.show();
        //console.log("解锁失败");
      }
    }

    // float_cur.addEventListener("click",function(){p3.init();},false);
    //注册触摸事件
    float_cur.addEventListener("touchstart",clearStart,false);
    float_cur.addEventListener("touchmove",clearMove,false);
    float_cur.addEventListener("touchend",clearEnd,false);
    //注册常规事件
    float_cur.addEventListener("mousedown",clearStart,false);
    float_cur.addEventListener("mousemove",clearMove,false);
    float_cur.addEventListener("mouseup",clearEnd,false);
  })();
  /*
  p3
    */
  var p3={
    init:function(){
      $p2.hide();
      $p3.show();
      audioRing.pause();
      // audioSay.play();

      // var $audioMusic=$("<audio preload loop src='tun.mp3'></audio>");
      //  $("body").append($audioMusic);
      //  audioMusic=$audioMusic[0];

    },
  };

  (function(){
    $("#btn-invite").click(function(){
      p4.init();
    });
  })();
  /*
  P4
   */
  var p4={
    init:function(){
      $p3.hide();
      $p4.show();


        audioSay.pause();
        audioMusic.play();

      //   var $audioMusic2=$("<audio preload loop src='ring.mp3'></audio>")
      // $("body").append($audioMusic2);
      // audioMusic2=$audioMusic2[0]
      //
    },
  };
 (function(){
    $p4.show();
    $("#mask_index").wScratchPad({
        size        : 50,
        bg          : "",
        fg          : "img/img-first.jpg",
        realtime    : false,
        scratchDown : null,
        scratchUp   : function(e, percent){
          if(percent > 70){
            this.clear();
            this.enable("enabled", false);
            $("#mask_index").hide(300);
            p5.init();
          }
        },
        scratchMove : function(e, percent){
          console.log(percent);
        },
        cursor: "crosshair"
    });
    $p4.hide();
  })();

  /*
  P5
   */
  var p5={
    init:function(){
      $p4.hide();
      $p5.show();
      audioMusic.pause();
      audioMusic2.play();
    },
  };
  (function(){
    $("body").on("click","#btn-celebrate",function(event) {
      p6.init();
    });
  })();

  /*
  P6
   */
  var p6={
    init:function(){
      $p5.hide();
      $p6.show();
    },
  };
  (function(){
    $("#towx").click(function(){
      $("#towxdiv").show();
    });
    $("#towxdiv").click(function(event) {
      $("#towxdiv").hide();
    });

  })();

  (function(){
    window.onload=function(){
      p2.init();

    }
  })();
});
