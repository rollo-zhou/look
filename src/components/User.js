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
import UserInfo from './UserInfo.js';

import UserLookList from './UserLookList.js';

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
    };
  },
  setShowImagType(type){
      UserLookList.setShowImagType(type,UserLookList);
  },
  renderHeader() {
    return (
      <UserInfo user={this.props.user}
        onSelect={this.setShowImagType}
        uid={this.props.uid}/>
    );
  },

  render() {
    return(
      <View style={styles.container}>
        <UserLookList renderHeader={this.renderHeader}
          user={this.props.user}
          uid={this.props.uid}
          frome="looks"/>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: globalVariables.background,
  },
});

export default User;
