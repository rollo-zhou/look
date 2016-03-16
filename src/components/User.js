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

const User = React.createClass({
  getInitialState() {
    return {
      searchPending: true,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      looks: [],
      uid:0,
      user: {},
      next:1
    };
  },

  getDefaultProps() {
    return {
      uid: 0,
      user: {},
      frome:""
    };
  },
  componentDidMount() {
    // console.log(this.props.search);
    this.processResults();
    this.queryRMLS();
  },

  getDataSource(looks) {
    return this.state.dataSource.cloneWithRows(looks);
  },

  renderHeader() {
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
          </View>
    );
  },
  renderFooter() {
    if (!this.state.next && !this.state.searchPending) {
      return (
        <View style={styles.doneView}>
          <Image source={require('../images/foxy.png')} style={styles.doneImage} />
        </View>
      );
    }

    return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
  },

  onEndReached() {
    console.log('onEndReached');
    if (this.state.next && !this.state.searchPending) {
      this.queryRMLS(this.props.uid, this.state.next, this.state.form);
    }
  },

  selectHouse(look) {
    console.log('selectHouse');
    // this.props.navigator.push({
    //   component: HouseDetails,
    //   title: 'Details',
    //   passProps: {
    //     user:look.look.user,
    //     form: this.state.form
    //   },
    // });
  },

  renderRow(look) {
     return (
      <TouchableOpacity activeOpacity={0.7} >
          <View style={styles.row}>
            <Image source={{uri:look.look.photos.small}}
            style={{height: (width/3)-2,width: (width/3)-2}}/>
          </View>
      </TouchableOpacity>

    );
  },

  render() {
    if (!this.state.searchPending && !this.state.looks.length) {
    }

    return (
      <View style={styles.container}>
        <ListView
          ref='listview'
          contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          renderFooter={this.renderFooter}
          renderRow={this.renderRow}
          onEndReached={this.onEndReached}
          renderHeader={this.renderHeader}
          onEndReachedThreshold={10}
          // initialListSize={15}
          pageSize={15}
          scrollRenderAheadDistance={10}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps={false}
          showsVerticalScrollIndicator={true}
        />
      </View>
    );
  },

  processResults(data) {
    if(!data){
      data=this.props;
    }
    this.setState({
      user: data.user,
      searchPending: false,
      form: data.form
    });
  },

  queryRMLS(uid ,page, form) {
    console.log('queryRMLS');
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

    if (!data.length) return;
    data=JSON.parse(data)
    if (!data.looks.length) return;

    const newLooks = this.state.looks.concat(data.looks);
    this.setState({
      looks: newLooks,
      searchPending: false,
      dataSource: this.getDataSource(newLooks),
      form: data.form,
      next: this.state.next+1
    });
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: globalVariables.background,
  },

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

  list: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  row: {

    padding: 1,
  },
  thumb: {
    // width: 64,
    // height: 64
  },

  centerText: {
    alignItems: 'center',
  },

  scrollSpinner: {
    marginVertical: 20,
  },

  doneView: {
    flexDirection: 'row',
    justifyContent: 'center'
  },

  doneImage: {
    width: 302 / 5,
    height: 252 / 5
  },
});

export default User;
