import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  TouchableOpacity
} from 'react-native';

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import globalVariables from '../globalVariables.js';
import UserCell from './UserCell.js';
import DoneFooter from './DoneFooter.js';

const UserList = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      users: [],
      animating: true,
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
    return <ActivityIndicator style={styles.scrollSpinner} />;
  },

  onEndReached() {
    if (this.state.next && !this.state.animating) {
      this.setState({ animating: true });
      this.queryRromServer(this.state.pageNo);
    }
  },

  renderRow(users) {
    return (
      <UserCell user={users.user} needShowTime={false} time={users.user.created_at} navigator={this.props.navigator}/>
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
        onEndReached={this.onEndReached}
        renderFooter={this.renderFooter}
        onEndReachedThreshold={10}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps={false}
        showsVerticalScrollIndicator={true}
        style={styles.container}
        enableEmptySections = {true}
      />
    );
  },

  queryRromServer(page) {
    globalVariables.queryRromServer(globalVariables.apiUserServer+this.props.user.id+'/'+this.props.from+'?page='+(page||1),this.processsResults);
  },

  processsResults(data) {
    if (!data||!data.users||!data.users.length) {
      this.setState({
        animating: false,
        next:false,
      });
      return;
    }
    var newUsers= this.state.users.concat(data.users);
    this.setState({
      users: newUsers,
      animating: false,
      dataSource: this.getDataSource(newUsers),
      pageNo: this.state.pageNo+1
    });
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
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

export default UserList;
