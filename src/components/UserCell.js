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
                <Text style={styles.userName}>+</Text>

              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
    );
  },
  addUser(){
    return false;
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
