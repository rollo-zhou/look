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
    queryRromServer(apiUrl,callBack,parameter) {
    this.apiServerHeaders["Content-Type"]=(parameter&&parameter.Content)?parameter.Content:this.apiServerHeaders["Content-Type"];
    var _this=this;
    Storage.getItem('cookie').then((cookie)=> {
          // console.log('haveLoadedUser');
          // if (cookie) {
            _this.apiServerHeaders["Cookie"]=cookie||"";
              fetch(
                apiUrl,
                {
                  method: (parameter&&parameter.method)||'get',
                  headers: _this.apiServerHeaders,
                  body:(parameter&&parameter.body)||'',
                })
                .then((response) => {
                  parameter&&parameter.callBackHeaders&&parameter.callBackHeaders(response.headers.map);
                  return response.json();
                })
                .then((responseText) => {
                  callBack&&callBack(responseText);
                })
                .catch(function (error) {
                  console.error('An error occured');
                  console.error(error.message);
                }
              );
          // }
          // else {
          //     throw 'GET_LOGIN_USER_FROM_STORAGE_FAILED'
          // }

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
      Storage.setItem('user-hyped',hyped_look_ids)
      .then(()=>{
          meInfo.hypedCallBack && meInfo.userCallBack();
        }
      );
    }
    if(meInfo.fannedUserIds){
      var fanned_user_ids={};
      var fannedLength=meInfo.fannedUserIds.length;
      for (var i = 0; i < fannedLength; i++) {
        fanned_user_ids[meInfo.fannedUserIds[i]]=i+1;
      };
      Storage.setItem('user-fanned', fanned_user_ids)
      .then(()=>{
          meInfo.fannedCallBack && meInfo.userCallBack();
        }
      );
    }

    if(meInfo.user){
      Storage.setItem('user', meInfo.user)
        .then(()=>{
          meInfo.userCallBack && meInfo.userCallBack();
        }
      );
    }
  },
}
