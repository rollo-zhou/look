import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import globalVariables from '../globalVariables.js';
import UserCell from './UserCell.js';
import DoneFooter from './DoneFooter.js';

const LeaderListItem = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      users: [],
      refreshing: true,
      next:true,
      pageNo:1,
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
      frome:"fans",
      navigator:""
    };
  },
  componentWillMount() {
      this.queryRromServer(1);
  },

  getDataSource(users) {
    return this.state.dataSource.cloneWithRows(users);
  },

  renderFooter() {
    if (!this.state.next) {
      return (
       <DoneFooter/>
      );
    }
  },

  onEndReached() {
    // if (this.state.next && !this.state.refreshing) {
    //   this.setState({ refreshing: true });
    //   this.queryRromServer(this.state.pageNo);
    // }
  },
  haveLoadData(){
    return !!this.state.users.length;
  },
  renderRow(users) {
    return (
      <UserCell user={users.user} needShowTime={false} needCenterView={true} time={users.user.created_at} navigator={this.props.navigator}/>
    );
  },
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   return JSON.stringify(nextState)!=JSON.stringify(this.state);
  // },
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderFooter={this.renderFooter}
        onEndReachedThreshold={10}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps={false}
        showsVerticalScrollIndicator={true}
        style={styles.container}
        enableEmptySections = {true}
        refreshControl={
          <RefreshControl
          onRefresh={this.queryRromServer}
          tintColor='#aaaaaa'
          refreshing={this.state.refreshing}
          progressBackgroundColor='#aaaaaa'
        />}
      />
    );
  },

  queryRromServer(page) {
    globalVariables.queryRromServer(globalVariables.apiServer+this.props.apiTypeUrl,this.processsResults);
  },

  processsResults(data) {
    if ((!data||!data.guys||!data.guys.length)&&(!data.girls||!data.girls.length)) {
      this.setState({
        refreshing: false,
        next:false,
      });
      return;
    }

    var newUsers=data.girls.concat(data.guys)
    newUsers=newUsers.sort(function(a,b){
      return b.user.karma_gain-a.user.karma_gain;
    });
    // newUsers=this.state.users.concat(newUsers);

    this.setState({
      users: newUsers,
      refreshing: false,
      next:false,
      dataSource: this.getDataSource(newUsers),
      pageNo: this.state.pageNo+1
    });
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalVariables.background,
  },
  commentContent: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  userName: {
    color:"#666"
    // fontWeight: "700"
  },
  commentBody: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  commentText: {
    flex: 1,
    flexDirection: "row"
  },
  cellBorder: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    // Trick to get the thinest line the device can display
    height: 1 / height,
    marginLeft: 4,
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10
  },
  scrollSpinner: {
    marginVertical: 20,
  },
});

export default LeaderListItem;
