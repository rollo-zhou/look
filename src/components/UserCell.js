import React from 'react-native';
const {
  ActivityIndicatorIOS,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} = React;

import globalVariables from '../globalVariables.js';
import User from './User.js';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import Storage from './Storage.js';
const { width, height } = Dimensions.get('window');

var UserCell = React.createClass({
  getDefaultProps() {
    return {
      user: {},
      navigator:"",
      onSelect:false,
      showByline:false,
    };
  },
  getInitialState() {
    return {
      isFaned:false,
    };
  },
  module:{
    user:{}
  },
  componentDidMount() {
    if(!this.props.user){
      return false;
    }
    Storage.getItem('user-fanned')
    .then((user)=>{
      if(!user)return;
        this.module.user=user;
        this.setState({isFaned:!!user[this.props.user.id]});
      }
    );
  },
  render() {
    if(!this.props.user){
      return false;
    }
    var byline=(<Text style={styles.commentText}>
                  {this.props.user.byline}
                       <Icon name="bullhorn" color="#4F8EF7" />
                </Text>);
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this.onSelect}>
          <View style={styles.commentContent}>
            <Image source={{uri:this.props.user.photo}}
                     style={styles.avatar}/>
            <View style={styles.commentBody}>
              <Text style={styles.userName}>
                {this.props.user.name}
              </Text>
            </View>
            <View style={styles.time}>
              <Icon name="clock-o"/>
              <Text style={styles.userName}>

              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={this.addUser}>
              <View style={styles.addUser} >
                <Text style={styles.userName}>{this.state.isFaned?"-":"+"}</Text>

              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
    );
  },
  addUser(){
    if(!this.module.userHyped) return;
    if(this.props.user && this.props.user.id){
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
    return false;
  },

  processsResults(data) {
    if (data && data.status=="ok") {
      delete this.module.user[this.props.user.id];
      this.setState({
        isFaned:false,
      });
    }else{
      this.module.user[this.props.user.id]=this.props.user.id;
      this.setState({
        isFaned:true,
      });
    }

    if (data && data.status){
      Storage.setItem('user-fanned',this.module.user)
      .then((user)=>{
        }
      );
    }
  },
  onSelect() {
    if(this.props.onSelect){
      this.props.onSelect(this.props.user);
    }else{
      this.props.navigator.push({
        component: User,
        title: 'User',
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
  commentContent: {
    padding: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
     backgroundColor: globalVariables.background,
    //backgroundColor: "transparent",
    opacity:0.97,
  },
  addUser: {
    margin:10,
    width: 45,
    height: 20,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#666',
    flexDirection: "column",
    justifyContent: "center",
  },
  userName: {
    // fontWeight: "400",
    color:"#666",
    fontSize:12,

  },
  commentBody: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
  },
  time: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 5,
  },
  commentText: {
    flex: 1,
    flexDirection: "row"
  },
  avatar: {
    borderRadius: 18,
    width: 36,
    height: 36,
    marginRight: 10,
    marginLeft:10,
  }

});

export default UserCell;
