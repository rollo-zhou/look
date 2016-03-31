import Storage from './components/Storage.js';

module.exports = {
  blue: '#22B8D8',
  green: '#666',
  orange: '#ff6204',
  background: '#f5f5f5',
  textColor: '#666',
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
