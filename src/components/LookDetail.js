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
import LookCell from './LookCell.js';
import User from './User.js';
import DoneFooter from './DoneFooter.js';

const LookDetail = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      comments: [],
      searchPending: true,
      next:true,
      pageNo:1,
    };
  },
  getDefaultProps() {
    return {
      look:{},
      navigator:"",
    };
  },
  componentDidMount() {
      this.queryRromServer(1);
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
        navigator={this.props.navigator}
        onSelect={function(){}}
        userCell={true}
      />
    );
  },
  onEndReached() {
    if (this.state.next && !this.state.searchPending) {
      this.setState({ searchPending: true });
      this.queryRromServer(this.state.pageNo);
    }
  },

  onSelectUser(user) {
    this.props.navigator.push({
      component: User,
      title: 'User',
      backButtonTitle:' ',
      passProps: {
        user:user,
        navigator:this.props.navigator,
      },
    });
  },
  renderRow(comments) {
    if(!comments.comment||!comments.comment.user){
      return false;
    }
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={()=>this.onSelectUser(comments.comment.user)}>
      <View >
          <View style={styles.commentContent}>
              <Image source={{uri:comments.comment.user.photo}}
                     style={styles.avatar}/>
            <View style={styles.commentBody}>
              <Text style={styles.userName}>
                {comments.comment.user.name}
              </Text>
              <Text style={styles.commentText}>
                {comments.comment.body}
              </Text>
            </View>
          </View>

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
        style={styles.container}
      />
    );
  },

  queryRromServer(page) {
    globalVariables.queryRromServer(globalVariables.apiLookServer+this.props.look.id+'/comments/'+(page||1),this.processsResults);
  },

  processsResults(data) {
    if (!data||!data.comments||!data.comments.length) {
      this.setState({
        searchPending: false,
        next:false,
      });
      return;
    }
    var newComments= this.state.comments.concat(data.comments);
    this.setState({
      comments: newComments,
      searchPending: false,
      dataSource: this.getDataSource(newComments),
      pageNo: this.state.pageNo+1
    });
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 44,
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
    color:"#666",
    fontSize:12,
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
