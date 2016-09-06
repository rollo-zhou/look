import Storage from './components/Storage.js';

module.exports = {
  blue: '#22B8D8',
  grey: '#666',
  green:'#009688',
  teal:'#009688',
  orange:'#FF9800',
  orange: '#ff6204',
  red:"#FF1654",
  background: '#f5f5f5',
  base:'#009688',
  base2:'',
  base3:'',
  textBase:'#929292',
  textBase1:'#009688',
  textBase2:'#d8d2d6',
  apiUserServer:'http://api.lookbook.nu/v1/user/',
  apiLookServer:'http://api.lookbook.nu/v1/look/',
  apiServer:'http://api.lookbook.nu/v1/',
  apiServerHeaders:{
    "Host": "api.lookbook.nu",
    "Cookie":"",
    "Content-Type": "application/json; charset=utf-8",
    "User-Agent": "Lookbook/1.7.3 CFNetwork/711.3.18 Darwin/14.0.0",
    "Accept-Encoding":"gzip, deflate",
    "Connection":"keep-alive"
  },
  user:{
    user:null,
    fanned:null,
    hyped:null,
  },
  queryRromServer(apiUrl,callBack,parameter) {
    this.apiServerHeaders["Content-Type"]=(parameter&&parameter.Content)?parameter.Content:this.apiServerHeaders["Content-Type"];
    var _this=this;
    Storage.getItem('cookie').then((cookie)=> {
      _this.apiServerHeaders["Cookie"]=cookie||"";
        fetch(
          apiUrl,
          {
            method: (parameter&&parameter.method)||'get',
            headers: _this.apiServerHeaders,
            body:(parameter&&parameter.body)||'',
          })
          .then((response) => {
            parameter && parameter.callBackHeaders && parameter.callBackHeaders(response.headers.map);
            return response.json();
          })
          .then((responseText) => {
            callBack && callBack(responseText);
          })
          .catch(function (error) {
            parameter && parameter.errorFunc && parameter.errorFunc();
            // AlertIOS.alert("网络连接错误");
            // console.error('An error occured');
            // console.error(error.message);
          }
        );
      })
      .catch((err)=> {
          console.warn(err)
      })
      .done()
  },
  saveMeInfo(meInfo){
    //{
    //  hypedLookIds:[],
    //  fannedUserIds:[],
    //  user:{},
    //  hypedCallBack:()=>{},
    //  fannedCallBack:()=>{},
    //  userCallBack:()=>{},
    //}
    if(meInfo.hypedLookIds){
      var hyped_look_ids={};
      var hypedLength=meInfo.hypedLookIds.length;
      for (var i = 0; i < hypedLength; i++) {
        hyped_look_ids[meInfo.hypedLookIds[i]]=i+1;
      };
      this.setUserHyped(hyped_look_ids,()=>{
         meInfo.hypedCallBack && meInfo.userCallBack();
      });
    }
    if(meInfo.fannedUserIds){
      var fanned_user_ids={};
      var fannedLength=meInfo.fannedUserIds.length;
      for (var i = 0; i < fannedLength; i++) {
        fanned_user_ids[meInfo.fannedUserIds[i]]=i+1;
      };

      this.setUserFanned(fanned_user_ids,()=>{
         meInfo.fannedCallBack && meInfo.userCallBack();
      });
    }

    if(meInfo.user){
      this.setUser(meInfo.user,()=>{
        meInfo.userCallBack && meInfo.userCallBack();
      });
    }
  },
  logout(){
    Storage.removeItem("user");
    Storage.removeItem("user-hyped");
    Storage.removeItem("user-fanned");
  },
  setUser(user,callBack){
    if(user&&user.id){
      Storage.setItem("user",user).then(()=>{
      callBack&&callBack();
    });
    }
  },
  setUserHyped(Hyped,callBack){
    Storage.setItem("user-hyped",Hyped).then(()=>{
      callBack&&callBack();
    });
  },
  setUserFanned(Fanned,callBack){
    Storage.setItem("user-fanned",Fanned).then(()=>{
      callBack&&callBack();
    });
  },
  getUser(callBack){
    Storage.getItem("user").then((user)=>{
      callBack&&callBack(user);
      return user;
    });
  },
  getUserHyped(callBack){
    Storage.getItem("user-hyped").then((hyped)=>{
      callBack&&callBack(hyped);
    });
  },
  getUserFanned(callBack){
    Storage.getItem("user-fanned").then((fanned)=>{
      callBack&&callBack(fanned);
    });
  },
  userIsLogin(callBack){
    this.getUser((user)=>{
      callBack&&callBack(user&&user.id,user);
    });
  },
  formatDateToString(dateStr){
    if(!dateStr)return '';
    var list=/(\d+-\d+-\d+T\d+:\d+:\d+)(-|\+)(\d+):(\d+)/ig.exec(dateStr);
    var timeZoneOffset=new Date().getTimezoneOffset()*60000;
    if(list&&list.length>1){
      if(list.length>2){
        var time=new Date(list[1].replace(/-/ig,'/').replace(/t/ig," "))-0;
        if(list.length==5){
          var timeAdd=list[3]*3600000+list[4]*60000;
          var timeLocal=new Date()-0;
          var timeAgo=list[2]=="-"?((timeLocal + timeZoneOffset) - (time+timeAdd)):((timeLocal + timeZoneOffset) - (time-timeAdd));
          var ago={
            m:timeAgo/60000,
            h:timeAgo/(60000*60),
            d:timeAgo/(60000*60*24),
            mo:timeAgo/(60000*60*24*30),
            y:timeAgo/(60000*60*24*365),
          }
          if(ago.y>=1)return Math.floor(ago.y)+"Y"
          else if(ago.mo>=1)return Math.floor(ago.mo)+"MO"
          else if(ago.d>=1)return Math.floor(ago.d)+"D"
          else if(ago.h>=1)return Math.floor(ago.h)+"H"
          else return Math.floor(ago.m)+"M"
        }
      }
    }
  },
}
