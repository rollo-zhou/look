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

const UserLooked = React.createClass({
  // mixins:[UserLookList],
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
      from:"hyped_looks"
    };
  },
  showImagListOrThumb(type){
      this.refs.UserLookList.setShowImagType(type);
  },
  renderHeader() {
    return (
      <View style={styles.mainSection}>
            <View style={styles.shotCounter}>
                    <Text style={styles.shotCounterText}
                      onPress={() => this.showImagListOrThumb("thumb")}
                    > 缩略图 </Text>
                </View>
                <View style={styles.shotCounter}>
                    <Text style={styles.shotCounterText}
                    onPress={() => this.showImagListOrThumb("list")}
                    > 列表 </Text>
                </View>
          </View>
    );
  },

  render() {
    return(
      <View style={styles.container}>
        <UserLookList renderHeader={this.renderHeader}
          user={this.props.user}
          uid={this.props.uid}
          from={this.props.from}
          ref="UserLookList"/>
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
   shotDetailsRow: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "white",
    flexDirection: "row",
     width: width,
  },
  shotCounter: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-between"
  },
  shotCounterText: {
    color: "#333"
  },
  mainSection: {
    flex: 3,
    alignItems: "stretch",
    padding: 10,
    // backgroundColor: "white"
  },
});

export default UserLooked;
