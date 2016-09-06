import React from 'react';
import {
  ActivityIndicator,
  ListView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  RefreshControl,
} from 'react-native';

import LookCell from './LookCell.js';
import LookListNoResults from './LookListNoResults.js';
import globalVariables from '../globalVariables.js';
import DoneFooter from './DoneFooter.js';
import UserCell from './UserCell.js';
var looks  = require('./looks.js');

const LookListItem = React.createClass({
  getInitialState() {
     var getSectionData = (dataBlob, sectionID) => {
        return dataBlob[sectionID];
    }
    var getRowData = (dataBlob, sectionID, rowID) => {
       return dataBlob[sectionID + ':' + rowID];
    }
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        getSectionHeaderData: getSectionData,
        getRowData: getRowData,
     }),
      looks: [],
      animating: false,
      refreshing:true,
      next:true,
      navigator:"",
      pageNo:1,
    };
  },

  getDefaultProps() {
    return {
      type:"hot",
      loadDate:false,
      apiTypeUrl:"hot",
      urlPageType:"/",
      needPaddingTop:false,
      needShowTime:true,
    };
  },

  componentWillMount() {
    // RCTJSCProfiler.nativeProfilerStart();
    // window.Perf = React.addons.Perf;
    // React.addons.Perf.start();
    if(this.props.loadDate){
      this.queryRromServer(1);
    }
  },
  componentDidMount(){
    // RCTJSCProfiler.RCTJSCProfilerStop();
    // console.log("React.addons.Perf.stop");
    // React.addons.Perf.stop();
    // React.addons.Perf.printWasted();
  },
  haveLoadData(){
    return !!this.state.looks.length;
  },

  getDataSource(looks) {
    var dataBlob = {};
    var sectionsID = [];
    var rowsID = [];
    looks.map((item, index)=>{
        sectionsID.push(index);
        dataBlob[index] = item.look;

        var rowID = rowsID[index] = [];
        var id = item.look.id;
        dataBlob[index + ':' + id] = item;
        rowID.push(id);
    });
    return this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionsID, rowsID);
  },
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   // console.log('LookListItem.js-shouldComponentUpdate');
  //   // return false;
  //   return JSON.stringify(nextState)!=JSON.stringify(this.state);
  // },
  renderFooter() {
    if (!this.state.next) {
      return (
       <DoneFooter/>
      );
    }
   return <ActivityIndicator style={styles.scrollSpinner} animating={this.state.animating}/>;

  },

  renderRow(looks) {
    if(!looks||!looks.look){
      return false;
    }
    return (
      <LookCell
        look={looks.look}
        navigator={this.props.navigator}
      />
    );
  },
  renderSectionHeader(look){
    // return false;
     return (
      <UserCell user={look.user} needShowTime={false} time={look.created_at} navigator={this.props.navigator}/>
    );
  },

  render() {
    console.log('LookListItem.js-render');

    if (!this.state.looks.length && !this.state.animating && !this.state.refreshing) {
      return (
        <View style={styles.container}>
          <LookListNoResults />
        </View>
      );
    }

    return (
      <ListView
       style={this.props.needPaddingTop?styles.container1:styles.container}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        onEndReached={this.onEndReached}
        renderFooter={this.renderFooter}
        renderSectionHeader={this.renderSectionHeader}
        onEndReachedThreshold={10}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps={false}
        pagingEnabled={false}
        initialListSize={1}
        pageSize={12}
        scrollRenderAheadDistance={1}
        removeClippedSubviews
        enableEmptySections
        showsVerticalScrollIndicator
        refreshControl={
          <RefreshControl
          onRefresh={this.reFreshQueryRMLS}
          tintColor='#aaaaaa'
          refreshing={this.state.refreshing}
          progressBackgroundColor='#aaaaaa'
        />}
      />
    );
  },

  onEndReached() {
    if (this.state.next && !this.state.animating&& !this.state.refreshing) {
      this.setState({ animating: true ,refreshing:false});
      this.queryRromServer(this.state.pageNo);
    }
  },

  reFreshQueryRMLS(page) {
    if (!this.state.animating&& !this.state.refreshing) {
      this.setState({ refreshing: true ,animating: false ,pageNo:1});
      this.queryRromServer(1);
    }
  },

  queryRromServer(page) {
    // this.processsResults();
    var url=globalVariables.apiServer+this.props.apiTypeUrl+'/'+(page||1)
    if(this.props.urlPageType!="/"){
      url=globalVariables.apiServer+this.props.apiTypeUrl+'?page='+(page||1)
    }
    var _this=this;
    globalVariables.queryRromServer(url,this.processsResults,{
      errorFunc:function(){
        _this.setState({
          refreshing:false,
          animating:false,
        });
      }
    });
  },

  processsResults(data) {
    // data=looks;
    if (!data||!data.looks||!data.looks.length){
      this.setState({
        animating: false,
        refreshing:false,
        next:false,
      });
      return;
    }
    var newLooks ='';
    if(this.state.refreshing){
      newLooks= data.looks;
    }else{
      newLooks= this.state.looks.concat(data.looks);
    }
    this.setState({
      looks: newLooks,
      animating: false,
      refreshing:false,
      dataSource: this.getDataSource(newLooks),
      pageNo: this.state.pageNo+1
    });
  }
});

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: globalVariables.background,
  },
  container1: {
    // flex: 1,
    paddingTop: 44,
    backgroundColor: globalVariables.background,
  },
  centerText: {
    alignItems: 'center',
  },
  spinner: {
    width: 30,
  },
  scrollSpinner: {
    marginVertical: 36,
  },
});

export default LookListItem;
