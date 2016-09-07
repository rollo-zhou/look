import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  TouchableOpacity
} from 'react-native';

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import globalVariables from '../globalVariables.js';
import Icon from 'react-native-vector-icons/Ionicons';
import Storage from './Storage.js';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Login from './Login.js';
import List from './LookListNoResults.js';


const UserInfo = React.createClass({
  getInitialState() {
    return {
      user:{
        id:0,
        photo:"",
        name:"",
        byline:"",
        fans_count:"",
        looks_count:"",
        karma_count:"",
        fanned_count:0,
      },
      isThumb:true,
      isMe:false,
    };
  },

  getDefaultProps() {
    return {
      user:{
        id:0,
        photo:"",
        name:"",
        byline:"",
        fans_count:"",
        looks_count:"",
        karma_count:"",
        fanned_count:0,
      },
      showImagListOrThumb:function(){},
      toLookedPage:function(){},
      toUserListPage:function(){},
    };
  },
  module:{
    userFanned:null,
    user:null,
  },
  componentWillMount() {
    this.setState({user:this.props.user});

    globalVariables.getUser((user)=>{
      if(user && user.id==this.props.user.id){
        this.setState({
          user:user,
          isMe:true,
        });
      }else{
        this.queryRromServer();
      }
    });
    globalVariables.getUserFanned((fanned)=>{
      if(!fanned)return;
        this.module.userFanned=fanned;
        this.setState({isFaned:!!fanned[this.props.user.id]});
      }
    );
  },
  logout(){
    globalVariables.logout();
    RCTDeviceEventEmitter.emit('Logout');
  },
  getBtnView(){
    if(this.state.isMe){
      return(<TouchableOpacity style={styles.addUserView} onPress={this.logout}>
              <Text style={styles.LogoutText}>Logout</Text>
            </TouchableOpacity>);
    }else{
      if(this.state.isFaned){
         return(<TouchableOpacity style={styles.addedUserView} onPress={this.addUser}>
                  <Icon name="ios-checkmark-outline" size={25} color={globalVariables.background}/>
                </TouchableOpacity>);
      }else{
         return(<TouchableOpacity style={styles.addUserView} onPress={this.addUser}>
                  <Text style={styles.addUserText}>+</Text>
                </TouchableOpacity>);
      }
    }
  },
  getNameView(){
    if(this.state.isMe){
      return(
         <View style={styles.hearder}>
         <View style={{flex:1}}></View>
          <View style={styles.meName}>
            <Text style={styles.userNameTest} > {this.state.user.name}</Text>
          </View>
          <TouchableOpacity style={styles.more} onPress={this.toMore}>
            <Icon name="ios-more-outline" size={35} color={globalVariables.textBase}/>
          </TouchableOpacity>
        </View>
        );
    }else{
      return false;
    }

  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  render() {
    if(!this.state.user){
      return false;
    }
    return (
      <View  style={[styles.flexContainer,{paddingTop: this.state.isMe?0:74}]}>
        {this.getNameView()}
        <View style={styles.mainSection}>
          <Image source={{uri:this.state.user.photo}} style={styles.avatar}/>
          <View style={styles.userInfoBody}>
            <View style={styles.userInfoHeader}>
              <TouchableOpacity style={[styles.userInfoView,{flex:4}]} onPress={() => this.toUserListPage("fans")}>
                <Text style={styles.numText} > {this.state.user.fans_count}</Text>
                <Text style={styles.strText} > FANS </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.userInfoView,{flex:4}]} onPress={() => this.toUserListPage("fanned")}>
                <Text style={styles.numText} > {this.state.user.fanned_count||0}</Text>
                <Text style={styles.strText} > FANNED </Text>
              </TouchableOpacity>
              <View style={[styles.userInfoView,{flex:4}]}>
                <Text style={styles.numText} > {this.state.user.looks_count}</Text>
                <Text style={styles.strText} > LOOKS</Text>
              </View>
              <View style={[styles.userInfoView,{flex:5}]}>
                <Text style={styles.numText} > {this.state.user.karma_count}</Text>
                <Text style={styles.strText} > KARMA</Text>
              </View>
            </View>
            {this.getBtnView()}
          </View>
        </View>


        <View style={styles.mainSection}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.showImagListOrThumb("thumb")} style={styles.cell}>
            <Icon name="ios-apps-outline" color={this.state.isThumb?globalVariables.base:globalVariables.textBase} size={30}/>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => this.showImagListOrThumb("list")} style={styles.cell}>
              <Icon name="ios-list-outline" color={this.state.isThumb?globalVariables.textBase:globalVariables.base} size={45}/>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => this.toLookedPage("HYPED")} style={styles.cell}>
            <Icon name="ios-flame-outline" color={globalVariables.textBase} size={35}/>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => this.toLookedPage("LOVED")} style={styles.cell}>
              <Icon name="ios-heart-outline" color={globalVariables.textBase} size={30}/>
          </TouchableOpacity>
        </View>
     </View>
    );
  },
  showImagListOrThumb(type){
    var isThumb=type=='thumb'?true:false;
    this.setState({isThumb:isThumb});
    this.props.showImagListOrThumb(type);
  },
  toLookedPage(type){
    var count= type=="LOVED"?this.state.user.loved_looks_count:this.state.user.hyped_looks_count;
    this.props.toLookedPage(type,count);
  },
  toUserListPage(type){
    this.props.toUserListPage(type);
  },
  addUser(){
    globalVariables.getUser((user)=>{
      if(!user){
        this.props.navigator.push({
          component: Login,
          backButtonTitle:' ',
          // backButtonIcon:this.state.backIcon,
          title: 'Login',
          passProps: {
            navigator:this.props.navigator,
          },
        });
        return;
      }

      if(this.state.user && this.state.user.id){
        var method=this.state.isFaned?"DELETE":"POST"
        this.setState({
          isFaned:!this.state.isFaned,
        });
        globalVariables.queryRromServer(globalVariables.apiUserServer+(this.state.user.id)+"/fan"
          ,this.addUserProcesssResults
          ,{
            method:method
          });
      }

  });
  },

  toMore(){
    this.props.navigator.push({
        component: List,
        backButtonTitle:' ',
        // backButtonIcon:this.state.backIcon,
        title: 'List'
      });
  },

  addUserProcesssResults(data) {
    if(!data) return;
    if (data.status!="fanned") {
      delete this.module.userFanned[this.state.user.id];
      this.setState({
        isFaned:false,
      });
    }else{
      this.module.userFanned[this.state.user.id]=this.state.user.id;
      this.setState({
        isFaned:true,
      });
    }

    if (data && data.status){
      globalVariables.setUserFanned(this.module.userFanned);
    }
  },

  queryRromServer() {
    globalVariables.queryRromServer(globalVariables.apiUserServer+(this.state.uid||this.state.user.id),this.processsResults);
  },
  processsResults(data) {
    if (!data) {
      return;
    }
    this.setState({
      user: data.user,
      uid:data.id
    });
    if(this.state.isMe){
      globalVariables.userIsLogin((isLogin,user)=>{
        if(isLogin){
          globalVariables.saveMeInfo(
          {
            hypedLookIds:data.user.hyped_look_ids||[],
            fannedUserIds:data.user.fanned_user_ids||[],
            user:data.user||{},
            hypedCallBack:()=>{},
            fannedCallBack:()=>{},
            userCallBack:()=>{}
          });
        }
      });
    }
  }
});

const styles = StyleSheet.create({
  flexContainer: {
      // 容器需要添加direction才能变成让子元素flex
      flexDirection: 'column',
      opacity:0.97,
      // padding: 0,
      paddingBottom:5,
      backgroundColor: globalVariables.background,
      width:width,
      // justifyContent: 'flex-start',
      // paddingTop: 84,
  },
  mainSection: {
    // flex: 1,
    flexDirection: 'row',
    // paddingBottom: 10,
    // alignItems: "center",
    justifyContent: 'flex-start',
  },

  userInfoBody: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    // marginLeft:5,
  },
  userInfoHeader: {
    flexDirection: "row",
    alignItems: "center"
  },
  userInfoView:{
      // flex:1,
      flexDirection: "column",
      alignItems:"center",
  },
  numText: {
    color:globalVariables.base,
    fontWeight:'600',
    // fontSize:12,
  },
  strText: {
    color:globalVariables.textBase,
    fontSize:12,
  },
  addUserView: {
    // width: width-200,
    height: 30,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: globalVariables.base,
    alignItems:'center',
    // margin:20,
    marginLeft:20,
    marginTop:20,
    marginBottom:20,
    marginRight:10,
    justifyContent: "center",
  },
  addedUserView: {
    // width: width-200,
    height: 30,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: globalVariables.base,
    borderColor: globalVariables.base,
    alignItems:'center',
    // margin:20,
    marginLeft:20,
    marginBottom:20,
    marginTop:20,
    marginRight:10,
    justifyContent: "center",
  },
  LogoutText:{
    color:globalVariables.base,
    // fontSize:16,
    // textAlign:"center",
  },
  userNameTest:{
    fontSize:16,
    fontWeight:"600",
    color:globalVariables.textBase,
  },
  addUserText:{
    color:globalVariables.base,
    fontSize:16,
    // textAlign:"center",
  },
  userInfoText: {
    fontSize:12,
    // marginLeft:20,
    // marginRight:20,
    flexDirection: "row",
    color:globalVariables.textBase2,
  },
  avatar: {
    borderRadius: 40,
    width: 80,
    height: 80,
    marginRight: 0,
    marginLeft:5,
    backgroundColor:globalVariables.textBase2,
  },
  cell: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meName:{
     flex: 4,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // height:44,
    // marginBottom:10
  },
  more:{
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
  },
  hearder:{
    // flex: 1,
    // 容器需要添加direction才能变成让子元素flex
    flexDirection: 'row',
    backgroundColor: globalVariables.background,
    // alignItems: 'center',
    // justifyContent: 'center',
    height:44,
    marginBottom:10
  }
});

export default UserInfo;
