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

  render() {

    return (
      <View style={{backgroundColor:'#f4f4f4',flex:1}}
       keyboardDismissMode='on-drag'
     keyboardShouldPersistTaps={false} >
          <Icon name="user" size={90} color="#666" style={styles.style_image} />
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
              onChangeText={username => this.setState({username})}

          />
          <View
              style={{height:1,backgroundColor:'#f4f4f4'}}
          />
          <TextInput
              style={styles.style_pwd_input}
              placeholder='PassWord'
              numberOfLines={1}
              secureTextEntry={true}
              textAlign='center'
              ref="password"
              clearButtonMode='while-editing'
              value={this.state.password}
              onChangeText={password => this.setState({password})}
              onSubmitEditing={this.login}
          />
           <TouchableOpacity
            onPress={this.login}
            >
          <View
              style={styles.style_view_commit}
           >
            <Text style={{color:'#fff'}}>
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
    globalVariables.queryRromServer(globalVariables.apiServer+'login',this.processsResults,{
      method:"POST",
      Content:"application/x-www-form-urlencoded",
      body:'user[email]=rolloxa@qq.com&user[password]=z123456',
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

    var hyped_look_ids={};
    var fanned_user_ids={};

    var hypedLength=data.hyped_look_ids.length;
    var fannedLength=data.fanned_user_ids.length;
    for (var i = 0; i < hypedLength; i++) {
      hyped_look_ids[data.hyped_look_ids[i]]=i;
    };
     for (var i = 0; i < fannedLength; i++) {
      fanned_user_ids[data.fanned_user_ids[i]]=i;
    };
    Storage.setItem('user-hyped',hyped_look_ids)
    .then(()=>{
      }
    );
    Storage.setItem('user-fanned', fanned_user_ids)
    .then(()=>{
      }
    );
    Storage.setItem('user', data.user)
      .then(()=>{
        this._sendNotification();
        this.props.navigator.pop();
      }
    ).catch(function (error) {});

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
    marginTop:40,
    alignSelf:'center',
  },
  style_user_input:{
      backgroundColor:'#fff',
      marginTop:10,
      height:35,
  },
   style_pwd_input:{
      backgroundColor:'#fff',
      height:35,
  },
   style_view_commit:{
      marginTop:15,
      marginLeft:10,
      marginRight:10,
      backgroundColor:'#63B8FF',
      height:35,
      borderRadius:5,
      justifyContent: 'center',
      alignItems: 'center',
  },
  style_view_unlogin:{
    fontSize:12,
    color:'#63B8FF',
    marginLeft:10,
  },
  style_view_register:{
    fontSize:12,
    color:'#63B8FF',
    marginRight:10,
    alignItems:'flex-end',
    flex:1,
    flexDirection:'row',
    textAlign:'right',
  }
});

export default Login;
