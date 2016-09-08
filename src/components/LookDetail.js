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
import LookCell from './LookCell.js';
import User from './User.js';
import DoneFooter from './DoneFooter.js';
import Icon from 'react-native-vector-icons/Ionicons';

const LookDetail = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      comments: [],
      next:true,
      pageNo:1,
      animating:true
    };
  },
  getDefaultProps() {
    return {
      look:{},
      navigator:"",
    };
  },
  componentWillMount() {
      this.queryRromServer(1);
  },

  getDataSource(comments) {
    // return false;
    return this.state.dataSource.cloneWithRows(comments);
  },

  renderFooter() {
    if (!this.state.next) {
      return (
       <DoneFooter/>
      );
    }
    return <ActivityIndicator style={styles.scrollSpinner} animating={this.state.animating}/>;
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
    if(this.props.look.comments_count==0){
      this.setState({
        next:false,
      });
      return;
    }

    if (this.state.next && !this.state.animating) {
      this.setState({ animating: true });
      this.queryRromServer(this.state.pageNo);
    }

  },

  onSelectUser(user) {
    this.props.navigator.push({
      component: User,
      title: user.name,
      backButtonTitle:' ',
      passProps: {
        user:user,
        navigator:this.props.navigator,
      },
    });
  },
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   console.log('LookDetail.js.js-shouldComponentUpdate');
  //   return JSON.stringify(nextState)!=JSON.stringify(this.state);
  // },
  renderRow(comments) {
    if(!comments.comment||!comments.comment.user){
      return false;
    }
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={()=>this.onSelectUser(comments.comment.user)} style={styles.flexContainer}>
        <Image source={{uri:comments.comment.user.photo}} style={styles.avatar}/>
        <View style={styles.commentBody}>
          <View style={styles.commentHeader}>
            <View style={{flex:1}}>
              <Text style={styles.userName}>{comments.comment.user.name}</Text>
            </View>
            <View style={styles.timeView}>
              <Icon name="ios-clock-outline" color={globalVariables.textBase} size={15}/>
              <Text style={styles.time}> {globalVariables.formatDateToString(comments.comment.created_at)}</Text>
            </View>
          </View>
          <Text style={styles.commentText}>{comments.comment.body}</Text>
        </View>
      </TouchableOpacity>
    );
  },

  render() {
    console.log(new Date()-0);
    console.log('LookDetail.js.js-render');
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
        animating: false,
        next:false,
      });
      return;
    }
    var newComments= this.state.comments.concat(data.comments);
    var next=newComments.length>=this.props.look.comments_count?false:true;
    this.setState({
      comments: newComments,
      animating: false,
      dataSource: this.getDataSource(newComments),
      pageNo: this.state.pageNo+1,
      next:next,
    });
  }
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    backgroundColor: globalVariables.background,
  },
  flexContainer: {
    opacity:0.97,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  commentBody: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  userName: {
    color:globalVariables.base,
    // fontSize:12,
  },
  timeView:{
    // width:50,
    flexDirection: "row",
    alignItems:'center',
    marginRight:5,
  },
  time:{
    color:globalVariables.textBase,
    fontSize:12,
    // ,
  },
  commentText: {
    // fontSize:12,
    marginTop:8,
    flexDirection: "row",
    color:globalVariables.textBase,
  },
  avatar: {
    borderRadius: 18,
    width: 36,
    height: 36,
    marginRight: 10,
    marginLeft: 5,
    backgroundColor:globalVariables.textBase2,
  },
  scrollSpinner: {
    marginVertical: 20,
  },
});

export default LookDetail;
