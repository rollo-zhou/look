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
      next:1,
      navigator:"",
    };
  },

  getDefaultProps() {
    return {
      type:"hot",
      loadDate:false,
      apiTypeUrl:"hot",
      urlPageType:"/",
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
        dataBlob[index] = item.look.user;

        var rowID = rowsID[index] = [];
        var id = item.look.id;
        dataBlob[index + ':' + id] = item;
        rowID.push(id);
    });
    return this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionsID, rowsID);
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
      this.setState({ searchPending: true });
      this.queryRromServer(this.state.next);
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
  renderSectionHeader(user){
     return (
      <UserCell user={user}  navigator={this.props.navigator}/>
    );
  },

  render() {
    if (!this.state.searchPending && !this.state.looks.length) {
      return (
        <View style={styles.container}>
          <LookListNoResults />
        </View>
      );
    }

    return (
      <ListView
       style={styles.container}
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
      this.queryRromServer(1);
      this.setState({ refreshing: true });
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
      if(this.state.refreshing)
        this.setState({ refreshing: false });
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
      next: this.state.next+1
    });
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 44,
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
