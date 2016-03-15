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

const HouseDetailsCaroselImage = React.createClass({
  getInitialState() {
    return {
      searchPending: true,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      looks: [],
      uid:0,
      next:1
    };
  },

  getDefaultProps() {
    return {
      uid: 0,
      frome:""
    };
  },
  componentDidMount() {
    // console.log(this.props.search);
    this.queryRMLS();
  },

  getDataSource(looks) {
    return this.state.dataSource.cloneWithRows(looks);
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
        <ListView
          ref='listview'
          contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          renderFooter={this.renderFooter}
          renderRow={this.renderRow}
          onEndReached={this.onEndReached}

          onEndReachedThreshold={10}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps={false}
          showsVerticalScrollIndicator={true}
        />

    );
  },

  queryRMLS(uid ,page, form) {
    console.log('queryRMLS');
    this.setState({ searchPending: true });

    fetch('http://api.lookbook.nu/v1/user/'+(uid||this.props.uid)+'/looks?page='+(page||1)+'&view=full',{
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

export default HouseDetailsCaroselImage;
