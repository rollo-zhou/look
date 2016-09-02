import React from 'react';
import {
  ActivityIndicatorIOS,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import globalVariables from '../globalVariables.js';
import LookCellThumbnail from './LookCellThumbnail.js';
import DoneFooter from './DoneFooter.js';
import LookCell from './LookCell.js';

const UserLookList = React.createClass({
  getInitialState() {
    return {
      searchPending: true,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      looks: [],
      uid:0,
      user: {},
      next:true,
      pageNo:1,
      showImagType:"thumb",
      listRowStyle:styles.thumb,
      refreshing:false,
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
      from:"looks",
      renderHeader:function(){},
      navigator:"",
      isMe:false,
      listCount:-1,
      needShowTime:true,
    };
  },
  componentWillMount() {
    // console.log(this.props.search);

    this.queryRromServer();
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
    // console.log('onEndReached');
    if (this.state.next && !this.state.searchPending) {
      this.queryRromServer(this.state.pageNo);
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  renderRow(looks) {
     if(this.state.showImagType=="list"){
        return (<LookCell
            look={looks.look}
            navigator={this.props.navigator}
            onUserSelect={function(){}}
            needShowTime={this.props.needShowTime}
            userCell={true}
          />);
      }
     return  (
      <LookCellThumbnail look={looks.look}
          navigator={this.props.navigator}
          onUserSelect={function(){}}
      />);
  },

  render() {
    if(this.props.isMe){
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
            style={styles.container}
            refreshControl={
            <RefreshControl
            onRefresh={this.reFreshQueryRMLS}
            tintColor='#aaaaaa'
            refreshing={this.state.refreshing}
            progressBackgroundColor='#aaaaaa'
          />}
          />
      );
    }else{
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
          style={styles.container}
        />
    );
    }

  },

  reFreshQueryRMLS(page) {
    if (!this.state.searchPending) {
      this.setState({ refreshing: true ,pageNo:1});
      if(this.refs.listview.refs.userInfo){
        this.refs.listview.refs.userInfo.queryRromServer();
      }
      this.queryRromServer(1);
    }else{
       this.setState({ refreshing: false });
    }
  },

  queryRromServer(page) {
    globalVariables.queryRromServer(globalVariables.apiUserServer+this.props.user.id+'/'+this.props.from+'?page='+(page||1),this.processsResults);
  },

  processsResults(data) {
    if (!data||!data.looks||!data.looks.length){
      this.setState({
        searchPending: false,
        refreshing:false,
        next:false,
      });
      return;
    }

    const newLooks = this.state.looks.concat(data.looks);
    var next=true;
    if(this.props.listCount>0&&newLooks.length>=this.props.listCount){
      next=false;
    }
    this.setState({
      looks: newLooks,
      searchPending: false,
      refreshing:false,
      dataSource: this.getDataSource(newLooks),
      form: data.form,
      pageNo: this.state.pageNo+1,
      next:next,
    });
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: -10,
    backgroundColor: globalVariables.background,
  },

  list: {

  },
  thumb: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },

  scrollSpinner: {
    marginVertical: 20,
    width:width,
  },
});

export default UserLookList;
