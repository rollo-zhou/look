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

import User from './User.js';

const LookDetail = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      users: [],
      searchPending: true,
      next:1
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
    };
  },
  componentDidMount() {
      this.queryRMLS(1);
  },

  getDataSource(users) {
    return this.state.dataSource.cloneWithRows(users);
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

  onSelectUser(users) {
    this.props.navigator.push({
      component: User,
      title: 'User',
      passProps: {
        user:users.user,
        navigator:this.props.navigator,
      },
    });
  },
  renderRow(users) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={()=>this.onSelectUser(users)}>
      <View >
          <View style={styles.commentContent}>
              <Image source={{uri:users.user.photo}}
                     style={styles.avatar}/>
            <View style={styles.commentBody}>
              <Text style={styles.userName}>
                {users.user.name}
              </Text>
              <Text style={styles.commentText}>
                {users.user.byline}
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

    fetch(globalVariables.apiUserServer+this.props.user.id+'/'+this.props.from+'?page='+(page||1),{
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
    if (!data.users.length) return;

    var newUsers= this.state.users.concat(data.users);

    this.setState({
      users: newUsers,
      searchPending: false,
      dataSource: this.getDataSource(newUsers),
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
