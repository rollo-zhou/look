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
  queryRromServer(apiUrl,callBack,callBackHeaders) {
    fetch(
    apiUrl,
    {
      method: 'get',
      headers: this.apiServerHeaders
    })
    .then((response) => {
      callBackHeaders&&callBackHeaders(response.headers.get("Set-Cookie"));
      return response.json();
    })
    .then((responseText) => {
      callBack&&callBack(responseText);
    })
    .catch(function (error) {
      console.error('An error occured');
      console.error(error.message);
    });
  },
}
