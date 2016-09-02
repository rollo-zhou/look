import React from 'react';
import {
  ActivityIndicatorIOS,
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Vibration,
} from 'react-native';

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
      <ScrollView style={styles.container}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps={false} >
        <View style={styles.containerView}>
          <Icon name="user" size={50} color={globalVariables.base} style={styles.userIcon} />
          <TextInput
              style={styles.style_user_input}
              placeholder='UserId'
              numberOfLines={1}
              autoFocus={true}
              textAlign='center'
              ref="username"
              clearButtonMode='while-editing'
              keyboardType='email-address'
              value={this.state.username}
              autoCapitalize="none"
              autoCorrect={false}
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
      </ScrollView>
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
  container:{
    paddingTop: 44,
    backgroundColor:globalVariables.background,
    flex:1,

  },
  containerView:{
    marginTop:80,
    marginLeft:40,
    marginRight:40,
  },
  userIcon:{
    // borderRadius:35,
    // height:70,
    // width:70,
    alignSelf:'center',
  },
  style_user_input:{
      // backgroundColor:'#fff',
      marginTop:20,
      height:40,
      borderColor: globalVariables.base,
      borderWidth: 1,
      borderRadius:3,
      fontSize:14,
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
