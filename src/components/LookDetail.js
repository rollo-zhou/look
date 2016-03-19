import React from 'react-native';
const {
  ActivityIndicatorIOS,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  Mixins,
  TouchableOpacity
} = React;

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import globalVariables from '../globalVariables.js';
import UserInfo from './UserInfo.js';
import UserLookList from './UserLookList.js';
import UserLooked from './UserLooked.js';
import LookCell from './LookCell.js';
import User from './User.js';

const LookDetail = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      comments: [],
      searchPending: true,
      next:1
    };
  },
  getDefaultProps() {
    return {
      look:{},
    };
  },
  componentDidMount() {
      this.queryRMLS(1);
  },

  getDataSource(comments) {
    return this.state.dataSource.cloneWithRows(comments);
  },

  renderFooter() {
    if (!this.state.next && !this.state.searchPending) {
      return (
       <DoneFooter/>
      );
    }
    return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
  },

  renderHeader() {
    return (
      <LookCell
        look={this.props.look}
      />
    );
  },

  onEndReached() {
    if (this.state.next && !this.state.searchPending) {
      this.setState({ searchPending: true });
      this.queryRMLS(this.state.next);
    }
  },

  selectLook(comment) {

  },
  onSelectUser(comment) {
    this.props.navigator.push({
      component: User,
      title: 'User',
      passProps: {
        user:comment.comment.user,
        navigator:this.props.navigator,
      },
    });
  },
  renderRow(comment) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={()=>this.onSelectUser(comment)}>
      <View >
          <View style={styles.commentContent}>
              <Image source={{uri:comment.comment.user.photo}}
                     style={styles.avatar}/>
            <View style={styles.commentBody}>
              <Text style={styles.userName}>
                {comment.comment.user.name}
              </Text>
              <Text style={styles.commentText}>
                {comment.comment.body}
              </Text>
            </View>
          </View>
          <View style={styles.cellBorder} />
        </View>
        </TouchableOpacity>
    );
  },

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        onEndReached={this.onEndReached}
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter}
        onEndReachedThreshold={10}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps={false}
        showsVerticalScrollIndicator={true}
      />
    );
  },

  queryRMLS(page) {

    fetch(globalVariables.apiLookServer+this.props.look.id+'/comments/'+(page||1),{
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
    data=JSON.parse(data)
    if (!data.comments.length) return;

    var newComments= this.state.comments.concat(data.comments);

    this.setState({
      comments: newComments,
      searchPending: false,
      dataSource: this.getDataSource(newComments),
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
  commentContent: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  userName: {
    fontWeight: "700"
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
  }
});

export default LookDetail;
