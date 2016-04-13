import React from 'react-native';
const {
  ActivityIndicatorIOS,
  ListView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  RefreshControl
} = React;

import LookCell from './LookCell.js';
import LookListNoResults from './LookListNoResults.js';
import globalVariables from '../globalVariables.js';
import DoneFooter from './DoneFooter.js';
import UserCell from './UserCell.js';

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
      searchPending: true,
      refreshing:false,
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

  componentDidMount() {
    if(this.props.loadDate){
      this.queryRromServer(1);
    }
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
  shouldComponentUpdate: function(nextProps, nextState) {
    // console.log('LookListItem.js-shouldComponentUpdate');
    // return false;
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  renderFooter() {
    if (!this.state.next && !this.state.searchPending) {
      return (
       <DoneFooter/>
      );
    }
    return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
  },

  onEndReached() {
    if (this.state.next && !this.state.searchPending) {
      // this.setState({ searchPending: true });
      this.queryRromServer(this.state.pageNo);
    }
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
     return (
      <UserCell user={look.user} needShowTime={false} time={look.created_at} navigator={this.props.navigator}/>
    );
  },

  render() {
    console.log('LookListItem.js-render');

    if (!this.state.searchPending && !this.state.looks.length) {
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
        showsVerticalScrollIndicator={true}
        initialListSize={1}
        pageSize={2}
        scrollRenderAheadDistance={10}
        removeClippedSubviews={true}
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
  reFreshQueryRMLS(page) {
    if (!this.state.searchPending) {
      // this.setState({ refreshing: true ,pageNo:1});
      this.queryRromServer(1);
    }else{
       // this.setState({ refreshing: false });
    }
  },

  queryRromServer(page) {
    var url=globalVariables.apiServer+this.props.apiTypeUrl+'/'+(page||1)
    if(this.props.urlPageType!="/"){
      url=globalVariables.apiServer+this.props.apiTypeUrl+'?page='+(page||1)
    }
    globalVariables.queryRromServer(url,this.processsResults);
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
    var newLooks ='';
    if(this.state.refreshing){
      newLooks= data.looks;
    }else{
      newLooks= this.state.looks.concat(data.looks);
    }
    this.setState({
      looks: newLooks,
      searchPending: false,
      refreshing:false,
      dataSource: this.getDataSource(newLooks),
      pageNo: this.state.pageNo+1
    });
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalVariables.background,
  },
  container1: {
    flex: 1,
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
