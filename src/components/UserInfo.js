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

const UserInfo = React.createClass({
  getInitialState() {
    return {
      searchPending: true,
      user:{},
      uid:0,
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
        karma_count:""
      },
      showImagListOrThumb:function(){},
      toLookedPage:function(){},
      toUserListPage:function(){},
    };
  },
  componentDidMount() {
    if(!this.props.user.id){
      this.queryRromServer();
    }
  },

  render() {
    return (<View>
          <View style={styles.headerContent}>
            <Image source={{uri:this.props.user.photo}} style={styles.playerAvatar} />
            <Text style={styles.shotTitle}>{this.props.user.name}</Text>
            <Text style={styles.playerContent}>
                <Text >{this.props.user.byline}</Text>
            </Text>
          </View>
          <View style={styles.mainSection}>
            <View style={styles.shotDetailsRow}>
                <View style={styles.shotCounter}>

                    <Text style={styles.shotCounterText} onPress={() => this.toUserListPage("fans")}> {this.props.user.fans_count} </Text>
                </View>
                <View style={styles.shotCounter}>

                    <Text style={styles.shotCounterText} onPress={() => this.toUserListPage("fanned")}> {this.props.user.looks_count} </Text>
                </View>
            </View>
          </View>
          <View style={styles.mainSection}>
            <View style={styles.shotDetailsRow}>
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
                <View style={styles.shotCounter}>
                    <Text style={styles.shotCounterText}
                      onPress={() => this.toLookedPage("HYPED")}
                    > HYPED({this.state.user.hyped_looks_count}) </Text>
                </View>
                <View style={styles.shotCounter}>
                    <Text style={styles.shotCounterText}
                    onPress={() => this.toLookedPage("LOVED")}
                    > LOVED({this.state.user.hyped_looks_count}) </Text>
                </View>
            </View>
          </View>
          </View>
    );
  },
  showImagListOrThumb(type){
    this.props.showImagListOrThumb(type);
  },
  toLookedPage(type){
    this.props.toLookedPage(type);
  },
  toUserListPage(type){
    this.props.toUserListPage(type);
  },

  queryRromServer() {
    globalVariables.queryRromServer(globalVariables.apiUserServer+(uid||this.props.user.id),this.processsResults);
  },
  processsResults(data) {
    if (!data) return;
    this.setState({
      user: data,
      searchPending: false,
      uid:data.id
    });
  }
});

const styles = StyleSheet.create({
  headerContent: {
    // flex: 2,
    paddingBottom: 20,
    paddingTop: 74,
    alignItems: "center",
    width: width,
    // backgroundColor: "#fff"
  },
  shotTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#574e53",
    lineHeight: 18
  },
  playerContent: {
    fontSize: 12,
    color: "#d8d2d6",
    // fontWeight: "400",
    lineHeight: 18
  },

  playerAvatar: {
    borderRadius: 40,
    width: 80,
    height: 80,
    position: "absolute",
    bottom: 60,
    left: width / 2 - 40,
    borderWidth: 2,
    borderColor: "#fff"
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
    flex: 1,
    alignItems: "stretch",
    padding: 10,
    // backgroundColor: "white"
  },
});

export default UserInfo;
