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
      <TouchableOpacity activeOpacity={0.8} style={styles.flexContainer} onPress={this.onSelect}>
          <View style={styles.cell}>
            <Image source={{uri:this.props.user.photo}}
                     style={styles.avatar}/>
              <Text style={styles.userName}>
                {this.props.user.name}
              </Text>
          </View>
          <TouchableOpacity style={styles.cellfixed} activeOpacity={0.8} onPress={this.addUser}>
              <View style={styles.addUserView} >
                <Text style={styles.addUserText}>{this.state.isFaned?"-":"+"}</Text>
              </View>
          </TouchableOpacity>
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
      // 容器需要添加direction才能变成让子元素flex
      flexDirection: 'row',
      opacity:0.97,
      padding: 5,
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
  addUserView: {
    width: 55,
    height: 25,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: globalVariables.base,
    alignItems:'center',
    // justifyContent: "center",
    // marginRight:10,
  },
  addUserText:{
    color:globalVariables.base,
    fontSize:16,
    // textAlign:"center",
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
    marginLeft:10,
  }
});

export default UserCell;
