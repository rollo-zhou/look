import React from 'react';
import {
  ActivityIndicatorIOS,
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
import UserInfo from './UserInfo.js';
import UserLookList from './UserLookList.js';
import UserLooked from './UserLooked.js';
import UserList from './UserList.js';

const User = React.createClass({
  getDefaultProps() {
    return {
      uid: 0,
      user: {
        uid: 0,
        photo:"",
        name:"",
        byline:"",
        fans_count:"",
        looks_count:"",
        karma_count:""
      },
      navigator:"",
      isMe:false,
    };
  },
  getInitialState() {
    return {
    };
  },
  showImagListOrThumb(type){
      this.refs.userLookList.setShowImagType(type);
  },
  toLookedPage(type,counts){
    this.props.navigator.push({
      component: UserLooked,
      title: type,
      backButtonTitle:' ',
      passProps: {
        user:this.props.user,
        navigator:this.props.navigator,
        counts:counts,
        from:type=="HYPED"?"hyped_looks":"loved_looks"
      },
    });
  },
  toUserListPage:function(type){
    this.props.navigator.push({
      component: UserList,
      title: type,
      backButtonTitle:' ',
      passProps: {
        user:this.props.user,
        uid:this.props.uid,
        from:type=="fans"?"fans":"fanned"
      },
    });
  },
  renderHeader() {
    return (
      <UserInfo user={this.props.user}
        ref="userInfo"
        showImagListOrThumb={this.showImagListOrThumb}
        toLookedPage={this.toLookedPage}
        toUserListPage={this.toUserListPage}
        uid={this.props.uid}
        isMe={this.props.isMe}
        navigator={this.props.navigator}/>
    );
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  render() {
    return(

      <View style={styles.container}>
        <UserLookList
          user={this.props.user}
          uid={this.props.uid}
          navigator={this.props.navigator}
          from="looks"
          isMe={this.props.isMe}
          listCount={this.props.user.looks_count}
          renderHeader={this.renderHeader}
          ref="userLookList"/>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalVariables.background,
  },

});

export default User;
