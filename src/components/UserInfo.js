import React from 'react-native';
const {
  ActivityIndicatorIOS,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  TouchableOpacity
} = React;

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import globalVariables from '../globalVariables.js';
import Icon from 'react-native-vector-icons/Ionicons';
import Storage from './Storage.js';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Login from './Login.js';

const UserInfo = React.createClass({
  getInitialState() {
    return {
      searchPending: true,
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
      uid:0,
      isThumb:true,
      isMe:false,
    };
  },

  getDefaultProps() {
    return {
      uid: 0,
      user: {
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
  componentDidMount() {
     // if(!this.props.user.id){
    this.queryRromServer();
    // }
    globalVariables.getUser((user)=>{
      if(!user)return;
        this.module.user=user;
      }
    );
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
    if(this.props.isMe){
      return(<TouchableOpacity style={styles.addUserView} onPress={this.logout}>
              <Text style={styles.LogoutText}>Logout</Text>
            </TouchableOpacity>);
    }else{
      if(this.state.isFaned){
         return(<TouchableOpacity style={styles.addedUserView} onPress={this.addUser}>
                  <Icon name="ios-checkmark-empty" size={22} color={globalVariables.background}/>
                </TouchableOpacity>);
      }else{
         return(<TouchableOpacity style={styles.addUserView} onPress={this.addUser}>
                  <Text style={styles.addUserText}>+</Text>
                </TouchableOpacity>);
      }
    }
  },
  getNameView(){
    if(this.props.isMe){
      return(<View style={[styles.cell,{height:44,marginBottom:10}]}>
          <Text style={styles.userNameTest} > {this.props.user.name}</Text>
        </View>);
    }else{
      return false;
    }

  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  render() {
    if(!this.props.user){
      return false;
    }
    return (
      <View  style={[styles.flexContainer,{paddingTop: this.props.isMe?0:54}]}>
        {this.getNameView()}
        <View style={styles.mainSection}>
          <Image source={{uri:this.props.user.photo}} style={styles.avatar}/>
          <View style={styles.userInfoBody}>
            <View style={styles.userInfoHeader}>
              <TouchableOpacity style={styles.userInfoView} onPress={() => this.toUserListPage("fans")}>
                <Text style={styles.numText} > {this.props.user.fans_count}</Text>
                <Text style={styles.strText} > FANS </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userInfoView} onPress={() => this.toUserListPage("fanned")}>
                <Text style={styles.numText} > {this.state.user.fanned_count}</Text>
                <Text style={styles.strText} > FANNED </Text>
              </TouchableOpacity>
              <View style={styles.userInfoView}>
                <Text style={styles.numText} > {this.props.user.looks_count}</Text>
                <Text style={styles.strText} > LOOKS</Text>
              </View>
              <View style={styles.userInfoView}>
                <Text style={styles.numText} > {this.props.user.karma_count}</Text>
                <Text style={styles.strText} > KARMA</Text>
              </View>
            </View>
            {this.getBtnView()}
          </View>
        </View>

        <View style={{paddingBottom: 5}}></View>
        <View style={styles.mainSection}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.showImagListOrThumb("thumb")} style={styles.cell}>
            <Icon name="grid" color={this.state.isThumb?globalVariables.base:globalVariables.textBase} size={30}/>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => this.showImagListOrThumb("list")} style={styles.cell}>
              <Icon name="navicon-round" color={this.state.isThumb?globalVariables.textBase:globalVariables.base} size={30}/>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => this.toLookedPage("HYPED")} style={styles.cell}>
            <Icon name="speakerphone" color={globalVariables.textBase} size={25}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.toLookedPage("LOVED")} style={styles.cell}>
              <Icon name="ios-heart" color={globalVariables.textBase} size={27}/>
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
    // var count= type=="LOVED"?this.state.user.loved_looks_count:this.state.user.hyped_looks_count;
    this.props.toLookedPage(type);
  },
  toUserListPage(type){
    this.props.toUserListPage(type);
  },
  addUser(){
    if(!this.module.user) {
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
    // if(!this.module.userFanned) return;
    if(this.props.user && this.props.user.id){
      var method=this.state.isFaned?"DELETE":"POST"
      this.setState({
        isFaned:!this.state.isFaned,
      });
      globalVariables.queryRromServer(globalVariables.apiUserServer+(this.props.user.id)+"/fan"
        ,this.addUserProcesssResults
        ,{
          method:method
        });
    }
    return false;
  },

  addUserProcesssResults(data) {
    if(!data) return;
    if (data.status!="fanned") {
      delete this.module.userFanned[this.props.user.id];
      this.setState({
        isFaned:false,
      });
    }else{
      this.module.userFanned[this.props.user.id]=this.props.user.id;
      this.setState({
        isFaned:true,
      });
    }

    if (data && data.status){
      globalVariables.setUserFanned(this.module.userFanned);
    }
  },

  queryRromServer() {
    globalVariables.queryRromServer(globalVariables.apiUserServer+(this.props.uid||this.props.user.id),this.processsResults);
  },
  processsResults(data) {
    if (!data) {
      this.setState({
        searchPending: false,
      });
      return;
    }
    this.setState({
      user: data.user,
      searchPending: false,
      uid:data.id
    });
    if(this.props.isMe){
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
      padding: 5,
      backgroundColor: globalVariables.background,
      // justifyContent: 'flex-start',
      // paddingTop: 84,
  },
  mainSection: {
    flex: 1,
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
      flex:1,
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
    fontSize:10,
  },
  addUserView: {
    // width: width-200,
    height: 25,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: globalVariables.base,
    alignItems:'center',
    margin:20,
    justifyContent: "center",
  },
  addedUserView: {
    // width: width-200,
    height: 25,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: globalVariables.base,
    borderColor: globalVariables.base,
    alignItems:'center',
    margin:20,
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
    marginRight: 5,
    marginLeft:10,
  },
  cell: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserInfo;
