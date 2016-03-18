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
import LookCellThumbnail from './LookCellThumbnail.js';
import DoneFooter from './DoneFooter.js';
import LookCell from './LookCell.js';

const UserLookList = React.createClass({
  statics:{
    setShowImagType(type){
      // that.setShowImagType(type);
      // alert(type);
    }
  },
  getInitialState() {
    return {
      searchPending: true,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      looks: [],
      uid:0,
      user: {},
      next:1,
      showImagType:"thumb",
      listRowStyle:styles.thumb
    };
  },

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
      frome:"looks",
      renderHeader:function(){},
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
  setShowImagType(type){
    if(type!=this.state.showImagType){
      var style=styles.thumb;
      var showImagType="thumb";
      if(type=="list"){
        style=styles.list;
        showImagType="list";
      }

      this.setState({
        dataSource:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        listRowStyle:style,
        showImagType:showImagType,
      });
      this.setState({
        dataSource: this.getDataSource(this.state.looks),
      });
    }
  },

  renderFooter() {
    if (!this.state.next && !this.state.searchPending) {
      return (
       <DoneFooter/>
      );
    }

    return (<ActivityIndicatorIOS style={styles.scrollSpinner} />);
  },

  onEndReached() {
    console.log('onEndReached');
    if (this.state.next && !this.state.searchPending) {
      this.queryRMLS(this.props.uid, this.state.next, this.state.form);
    }
  },

  renderRow(look) {
     if(this.state.showImagType=="list"){
        return (<LookCell
            key={look.look.id}
            look={look.look}
          />);
      }
     return  (<LookCellThumbnail photo={look.look.photos.small}/>);
  },

  render() {
    if (!this.state.searchPending && !this.state.looks.length) {
    }

    return (
        <ListView
          ref='listview'
          contentContainerStyle={this.state.listRowStyle}
          dataSource={this.state.dataSource}
          renderFooter={this.renderFooter}
          renderRow={this.renderRow}
          onEndReached={this.onEndReached}
          renderHeader={this.props.renderHeader}
          onEndReachedThreshold={10}
          // initialListSize={15}
          pageSize={15}
          scrollRenderAheadDistance={10}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps={false}
          showsVerticalScrollIndicator={true}
        />
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

    fetch('http://api.lookbook.nu/v1/user/'+(uid||this.props.user.id)+'/'+this.props.frome+'?page='+(page||1)+'&view=full',{
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

  list: {

  },
  thumb: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  scrollSpinner: {
    marginVertical: 20,
  },
});

export default UserLookList;