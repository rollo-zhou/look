import React from 'react-native';
const {
  ActivityIndicatorIOS,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  Mixins,
  TouchableOpacity
} = React;

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import globalVariables from '../globalVariables.js';
import UserInfo from './UserInfo.js';
import UserLookList from './UserLookList.js';
import UserLooked from './UserLooked.js';
import UserList from './UserList.js';

const User = React.createClass({
  // mixins:[UserInfo],
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
    };
  },
  showImagListOrThumb(type){
      // this.refs.userLookList.setShowImagType(type);
  },
  toLookedPage(type){
    this.props.navigator.push({
      component: UserLooked,
      title: type,
      backButtonTitle:' ',
      passProps: {
        user:this.props.user,
        uid:this.props.uid,
        navigator:this.props.navigator,
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
        navigator={this.props.navigator}/>
    );
  },
  refreshFunc(){
    // this.queryRromServer();
  },
  render() {
    return(
      <View style={styles.container}>
        <UserLookList renderHeader={this.renderHeader}
          user={this.props.user}
          uid={this.props.uid}
          navigator={this.props.navigator}
          from="looks"
          refreshFunc={this.refreshFunc}
          ref="userLookList"/>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 64,
    backgroundColor: globalVariables.background,
  },

});

export default User;
