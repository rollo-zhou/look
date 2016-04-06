import React from 'react-native';
const {
  ActivityIndicatorIOS,
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Vibration,
} = React;

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import globalVariables from '../globalVariables.js';
import Storage from './Storage.js';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = React.createClass({
  getInitialState() {
    return {
      username: '',
      password: '',
    };
  },
  getDefaultProps() {
    return {
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  render() {
    return (
      <View style={{backgroundColor:'#f4f4f4',flex:1,marginLeft:40,marginRight:40,}}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps={false} >
          <Icon name="user" size={90} color={globalVariables.base} style={styles.style_image} />
          <TextInput
              style={styles.style_user_input}
              placeholder='UserId'
              numberOfLines={1}
              autoFocus={true}
              textAlign='center'
              ref="username"
              clearButtonMode='while-editing'
              keyboardType='twitter'
              value={this.state.username}
              onChangeText={username => this.setState({username})} />

          <TextInput
              style={styles.style_user_input}
              placeholder='Password'
              numberOfLines={1}
              secureTextEntry={true}
              textAlign='center'
              ref="password"
              clearButtonMode='while-editing'
              value={this.state.password}
              onChangeText={password => this.setState({password})}
              onSubmitEditing={this.login} />

          <TouchableOpacity onPress={this.login} >
            <View style={styles.style_view_commit} >
              <Text style={{color: globalVariables.base}}>
                 Log In
              </Text>
            </View>
          </TouchableOpacity>
      </View>
    );
  },

  login() {
    const { username, password } = this.state;
    if(!username||!password){
      Vibration.vibrate();
      return;
    }
    var body='user[email]='+username+'&user[password]='+password;
    globalVariables.queryRromServer(globalVariables.apiServer+'login',this.processsResults,{
      method:"POST",
      Content:"application/x-www-form-urlencoded",
      body:body,
      callBackHeaders:function(data){
        if(data["set-cookie"]&&data["set-cookie"][0]){
          Storage.setItem('cookie', data["set-cookie"][0])
          .then(()=>{
              return "";
            }
          ).catch(function (error) {});
        }
      }
    });
  },
  processsResults(data) {
    if (!data||!data.status.toLocaleLowerCase()=='success'){
      Vibration.vibrate();
      return;
    }

    globalVariables.saveMeInfo(
      {
        hypedLookIds:data.hyped_look_ids||[],
        fannedUserIds:data.fanned_user_ids||[],
        user:data.user||{},
        hypedCallBack:()=>{},
        fannedCallBack:()=>{},
        userCallBack:()=>{
          this._sendNotification();
          this.props.navigator.pop();
        }
      });
  },
  _sendNotification() {
    RCTDeviceEventEmitter.emit('Login');
  }
});

const styles = StyleSheet.create({
 style_image:{
    borderRadius:35,
    height:70,
    width:70,
    marginTop:80,
    alignSelf:'center',
  },
  style_user_input:{
      // backgroundColor:'#fff',
      marginTop:20,
      height:40,
      borderColor: globalVariables.base,
      borderWidth: 1,
       borderRadius:3,
  },
   style_pwd_input:{
      // backgroundColor:'#fff',
      height:40,
      borderColor: globalVariables.base,
      borderWidth: 1,
       borderRadius:3,
  },
   style_view_commit:{
      marginTop:25,
      borderColor:globalVariables.base,
      borderWidth:1,
      height:40,
      borderRadius:3,
      justifyContent: 'center',
      alignItems: 'center',
  },
});

export default Login;
