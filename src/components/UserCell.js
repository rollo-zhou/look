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
          </View>
        </TouchableOpacity>
    );
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
  userName: {
    // fontWeight: "400",
    color:"#666"
  },
  commentBody: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
  },
  commentText: {
    flex: 1,
    flexDirection: "row"
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10
  }

});

export default UserCell;
