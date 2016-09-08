import React from 'react';
import {
  ActivityIndicator,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

import globalVariables from '../globalVariables.js';
import User from './User.js';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import Storage from './Storage.js';
import Login from './Login.js';
const { width, height } = Dimensions.get('window');

var UserCell = React.createClass({
  getDefaultProps() {
    return {
      user: {},
      navigator:"",
      onSelect:false,
      showByline:false,
      needShowTime:true,
      title:"",
      time:"",
      needCenterView:false
    };
  },
  getInitialState() {
    return {
      isFaned:false,
      isMe:false,
    };
  },
  module:{
    userFanned:null,
    user:null,
  },
  componentWillMount() {
    if(!this.props.user){
      return false;
    }
    globalVariables.getUser((user)=>{
      if(user && user.id==this.props.user.id){
        this.setState({
          isMe:true,
        });
      }
    });
    globalVariables.getUserFanned((fanned)=>{
      if(!fanned)return;
        this.module.userFanned=fanned;
        this.setState({isFaned:!!fanned[this.props.user.id]});
      }
    );
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    // return false;
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  getRightView(){
    if(this.props.needShowTime||this.state.isFaned||this.state.isMe){
      return(
          <View style={styles.timeView} >
            <Icon name="ios-clock-outline" color={globalVariables.textBase} size={20}/>
            <Text style={styles.timeText}> {globalVariables.formatDateToString(this.props.time)}</Text>
          </View>
        );
    }else{
      return (
        <TouchableOpacity style={styles.cellfixed} activeOpacity={0.8} onPress={this.addUser}>
          <View style={styles.addUserView} >
            <Text style={styles.addUserText}>+</Text>
          </View>
        </TouchableOpacity>);
    }
  },

  getCenterView(){
    if(this.props.needCenterView){
      return(
    <View style={styles.karmaView}>
    <Icon name="ios-flame-outline" color={globalVariables.base} size={20}/>
          <Text style={[styles.timeText,{color:globalVariables.base}]}> {this.props.user.karma_gain}</Text>
    </View>
     );
    }

  },

  render() {
    if(!this.props.user){
      return false;
    }
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.flexContainer} onPress={this.onSelect}>
        <View style={styles.cell}>
          <Image source={{uri:this.props.user.photo}} style={styles.avatar}/>
          <View style={styles.cellColumn}>
            <Text style={styles.userName}>
              {this.props.user.name}
            </Text>
          </View>
        </View>
        {this.getCenterView()}
        {this.getRightView()}
      </TouchableOpacity>
    );
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
        }else if(this.props.user && this.props.user.id){
          var method=this.state.isFaned?"DELETE":"POST"
          this.setState({
            isFaned:!this.state.isFaned,
          });
          globalVariables.queryRromServer(globalVariables.apiUserServer+(this.props.user.id)+"/fan"
            ,this.processsResults
            ,{
              method:method
            });
        }
      });
    return false;
  },

  processsResults(data) {
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
  onSelect() {
    if(this.props.onSelect){
      this.props.onSelect(this.props.user);
    }else{
      this.props.navigator.push({
        component: User,
        title: this.props.user.name,
        backButtonTitle:' ',
        passProps: {
          user:this.props.user,
          navigator:this.props.navigator,
        },
      });
    }
  },
});

const styles = StyleSheet.create({
  flexContainer: {
     flex: 1,
      // 容器需要添加direction才能变成让子元素flex
      flexDirection: 'row',
      opacity:0.97,
      padding: 10,
      backgroundColor: globalVariables.background,
      alignItems: 'center',
  },
  cellfixed: {
    width: 65,
  },
  cell: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  cellColumn: {
    flexDirection: 'column',
    // justifyContent: 'flex-start',
    justifyContent: 'center',
  },
  timeView:{
    // flex: 1,
    // width: 50,
    alignItems:'center',
    flexDirection: 'row',
    marginRight:25,
  },
  karmaView:{
    // flex: 1,
    // width: 50,
    alignItems:'center',
    flexDirection: 'row',
    paddingRight:15,
  },
  addUserView: {
    // flex: 1,
    width: 60,
    height: 30,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: globalVariables.base,
    alignItems:'center',
    justifyContent: "center",
    // marginRight:10,
  },
  addUserText:{
    color:globalVariables.base,
    fontSize:16,
    // textAlign:"center",
  },
  timeText:{
    color:globalVariables.textBase,
    fontSize:14,
    marginLeft:3,
  },
  userName: {
    // fontWeight: "400",
    color:globalVariables.base,
    // fontSize:12,
    marginLeft:3,
  },
  avatar: {
    borderRadius: 18,
    width: 36,
    height: 36,
    marginRight: 5,
    marginLeft:5,
    backgroundColor:globalVariables.textBase2,
  }
});

export default UserCell;
