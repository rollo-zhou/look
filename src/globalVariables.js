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
        "Cookie":"_lookbook_session=BAh7C0kiD3Nlc3Npb25faWQGOgZFVEkiJTFhYWQ4ODZlZTRhODNkOGE2MDQ1ODExMjA0ODQxMmNlBjsAVEkiEG1vYmlsZV92aWV3BjsARkZJIgpnZW9pcAY7AEZ7DToRY291bnRyeV9jb2RlIgdjbjoSY291bnRyeV9jb2RlMyIIQ0hOOhFjb3VudHJ5X25hbWUiCkNoaW5hOgtyZWdpb24iBzIzOhByZWdpb25fbmFtZSINU2hhbmdoYWk6CWNpdHkiDVNoYW5naGFpOg1sYXRpdHVkZWYWMzEuMDQ1NjAwODkxMTEzMjg6DmxvbmdpdHVkZWYXMTIxLjM5OTY5NjM1MDA5NzY2SSILbG9jYWxlBjsARkkiB2NuBjsAVEkiDHVzZXJfaWQGOwBGaQNOFFFJIgp0b2tlbgY7AEZJIjdDeURVdEtvS1pkZmxFb3RRcHNOaG1obEdxRU9BSFhUT2t3UWJVS0N0ZWdBckpRc0FuVgY7AFQ%3D--40f3b099895933e8740f8a953d7683d28a7f0b83; user_id=5313614",
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
