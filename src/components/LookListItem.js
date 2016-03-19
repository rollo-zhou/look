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
import User from './User.js';
import LookListNoResults from './LookListNoResults.js';
import globalVariables from '../globalVariables.js';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import DoneFooter from './DoneFooter.js';
import LookDetail from './LookDetail.js';

const LookListItem = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      looks: [],
      searchPending: true,
      refreshing:false,
      next:1
    };
  },

  getDefaultProps() {
    return {
      type:"hot",
      loadDate:false,
      apiTypeUrl:"hot"
    };
  },

  componentDidMount() {
    if(this.props.loadDate){
      this.queryRMLS(1);
    }
  },

  getDataSource(looks) {
    return this.state.dataSource.cloneWithRows(looks);
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
      this.queryRMLS(this.state.next);
    }
  },

  selectLook(look) {
    this.props.navigator.push({
      component: LookDetail,
      title: 'Details',
      passProps: {
        look:look.look,
        user:look.look.user,
        navigator:this.props.navigator,
      },
    });
  },

  onSelectUser(look) {
    this.props.navigator.push({
      component: User,
      title: 'User',
      passProps: {
        user:look.look.user,
        navigator:this.props.navigator,
      },
    });
  },

  renderRow(look) {
    return (
      <LookCell
        onSelect={() => this.selectLook(look)}
        onSelectUser={() => this.onSelectUser(look)}
        look={look.look}
      />
    );
  },

  render() {
    // _this=this;
    if (!this.state.searchPending && !this.state.looks.length) {
      return (
        <View style={styles.container}>
          <LookListNoResults />
        </View>
      );
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        onEndReached={this.onEndReached}
        renderFooter={this.renderFooter}
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
      this.queryRMLS(1);
      this.setState({ refreshing: true });
    }
  },

  queryRMLS(page) {
    console.log('queryRMLS');

    fetch(globalVariables.apiLookServer+this.props.apiTypeUrl+'/'+(page||1),{
      method: 'get',
      headers: globalVariables.apiServerHeaders
    })
    .then((response) => response.text())
    .then((responseText) => {
      this.processsResults(responseText);
    })
    .catch(function (error) {
      console.error('An error occured');
      console.error(error.message);
    });
  },

  processsResults(data) {
    if (!data.length){
      if(this.state.refreshing)
        this.setState({ refreshing: false });
      return;
    }
    data=JSON.parse(data)
    if (!data.looks.length) return;

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
    // paddingTop: 64,
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
