import React from 'react';
import {
  ActivityIndicator,
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
      animating:false
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
          <Text style={styles.userIcon}>Log in to LookBook</Text>

          <TextInput
              style={styles.style_user_input}
              placeholder='UserId'
              numberOfLines={1}
              autoFocus={true}
              ref="username"
              clearButtonMode='while-editing'
              keyboardType='email-address'
              value={this.state.username}
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onChangeText={username => this.setState({username})} />
          <TextInput
              style={styles.style_user_input}
              placeholder='Password'
              numberOfLines={1}
              secureTextEntry={true}
              enablesReturnKeyAutomatically={true}
              ref="password"
              clearButtonMode='while-editing'
              value={this.state.password}
              onChangeText={password => this.setState({password})}
              onSubmitEditing={this.login} />

          <TouchableOpacity onPress={this.login} >
            <View style={styles.style_view_commit} >
              <Text style={{color: 'white'}}>
                 Log In
              </Text>
            </View>
          </TouchableOpacity>

          <ActivityIndicator style={styles.scrollSpinner} animating={this.state.animating}/>

          </View>
      </ScrollView>
    );
  },

  login() {
    this.setState({animating:true});
    const { username, password } = this.state;
    if(!username||!password){
      Vibration.vibrate();
      this.setState({animating:false})
      return;
    }
    var body='user[email]='+username+'&user[password]='+password;
    globalVariables.queryRromServer(globalVariables.apiServer+'login',this.processsResults,{
      method:"POST",
      Content:"application/x-www-form-urlencoded",
      body:body,
      errorFunc:function(){this.setState({animating:false});},
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
    this.setState({animating:false});
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
    paddingTop: 64,
    backgroundColor:globalVariables.background,
    flex:1,

  },
  containerView:{
    marginTop:10,
    marginLeft:40,
    marginRight:40,
  },
  userIcon:{
    // borderRadius:35,
    // height:70,
    // width:70,
    alignSelf:'center',
    marginBottom:25,
    fontSize:25,
    color: globalVariables.base,
    fontWeight:"200",
  },
  style_user_input:{
      // backgroundColor:'#fff',
      marginTop:20,
      height:45,
      borderColor: globalVariables.base,
      borderWidth: 0.5,
      borderRadius:3,
      fontSize:14,
      backgroundColor:'white',
      // backgroundColor:"#EEEEEE",
      // opacity:0.1,
       textAlign:"center",
       color: globalVariables.base
  },
   style_view_commit:{
      marginTop:30,
      // borderColor:globalVariables.base,
      // borderWidth:1,
      height:45,
      borderRadius:3,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:globalVariables.base,
  },
  image: {
    flex: 1,
    opacity:0.7,
    resizeMode: 'cover',
    width: width,
    height: null,
  },
  scrollSpinner: {
    marginVertical: 20,
  }
});

export default Login;
