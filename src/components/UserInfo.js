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
      onSelect:function(){}
    };
  },
  componentDidMount() {
    if(!this.props.user.id){
      this.queryRMLS();
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

                    <Text style={styles.shotCounterText}> {this.props.user.fans_count} </Text>
                </View>
                <View style={styles.shotCounter}>

                    <Text style={styles.shotCounterText}> {this.props.user.looks_count} </Text>
                </View>
                <View style={styles.shotCounter}>

                    <Text style={styles.shotCounterText}> {this.props.user.karma_count} </Text>
                </View>
            </View>
          </View>
          <View style={styles.mainSection}>
            <View style={styles.shotDetailsRow}>
                <View style={styles.shotCounter}>
                    <Text style={styles.shotCounterText}
                      onSelect={() => this.selectLook("list")}
                    > 缩略图 </Text>
                </View>
                <View style={styles.shotCounter}>
                    <Text style={styles.shotCounterText}
                    onSelect={() => this.selectLook("thumb")}
                    > 列表 </Text>
                </View>
            </View>
          </View>
          </View>
    );
  },

  queryRMLS(uid ,page, form) {
    this.setState({ searchPending: true });

    fetch('http://api.lookbook.nu/v1/user/'+(uid||this.props.user.id)+'/looks?page='+(page||1)+'&view=full',{
      method: 'get',
      headers: {
        "Host": "api.lookbook.nu",
        "Cookie":"_lookbook_session=BAh7CUkiD3Nlc3Npb25faWQGOgZFVEkiJTMzYzAxODNlMzdiNTVhYWYxMTUxY2NlNmJiZmEwMmY5BjsAVEkiEG1vYmlsZV92aWV3BjsARkZJIgpnZW9pcAY7AEZ7DToRY291bnRyeV9jb2RlIgdjbjoSY291bnRyeV9jb2RlMyIIQ0hOOhFjb3VudHJ5X25hbWUiCkNoaW5hOgtyZWdpb24iBzAyOhByZWdpb25fbmFtZSINWmhlamlhbmc6CWNpdHkiDUhhbmd6aG91Og1sYXRpdHVkZWYWMzAuMjkzNjAwMDgyMzk3NDY6DmxvbmdpdHVkZWYWMTIwLjE2MTM5OTg0MTMwODZJIgtsb2NhbGUGOwBGSSIHY24GOwBU--29e77b70102f412d9bec0be23095aec47b646ac2",
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "Lookbook/1.7.3 CFNetwork/711.3.18 Darwin/14.0.0",
        "Accept-Encoding":"gzip, deflate",
        "Connection":"keep-alive"
      }
    })
    .then((response) => response.text())
    .then((responseText) => {
      // console.log(responseText);
      this.processsResults(responseText);
    })
    .catch(function (error) {
      console.error('An error occured');
      console.error(error.message);
    });
  },

  processsResults(data) {
    if (!data) return;
    data=JSON.parse(data)
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
    paddingTop: 94,
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
    fontWeight: "400",
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
