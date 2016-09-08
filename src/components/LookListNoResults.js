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

const List = React.createClass({
    getInitialState() {
      var getSectionData = (dataBlob, sectionID) => {
          return dataBlob[sectionID];
      }
      var getRowData = (dataBlob, sectionID, rowID) => {
          //console.log(dataBlob, sectionID, rowID)
          return dataBlob[rowID];
      }
      return {
        dataSource: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        getSectionData: getSectionData,
          getRowData: getRowData,
        }),
        comments: [],
        next:true,
        pageNo:1,
        animating:true,
        username:""
      };

    },
 getDefaultProps() {
    return {
      look:{"id":8397865,"title":"This is a Hipster of Berlin","created_at":"2016-09-06T14:06:31-04:00","comments_count":8,"photo_width":556,"photo_height":560,"description":"Find more pictures and details on my blog:\r<br/><a href=\"http://www.masha-sedgwick.com/typical-berlin//\">Masha Sedgwick</a>\r<br/>\r<br/><a href=\"http://www.masha-sedgwick.com/?attachment_id=28468\"><img class=\"alignleft size-full wp-image-28468\" src=\"http://www.masha-sedgwick.com/wp-content/uploads/2016/05/berlin-hipster-1.jpg\" alt=\"Berlin Hipster style | find more details on my blog | fashion blog | jeans skirt from American Apparel, green bomber jacket from Pinko, Rihanna x Stance socks\" /></a>\r<br/>\r<br/><a href=\"http://www.masha-sedgwick.com/?attachment_id=28473\"><img class=\"alignleft wp-image-28473\" src=\"http://www.masha-sedgwick.com/wp-content/uploads/2016/05/berlin-hipster-6.jpg\" alt=\"Berlin Hipster style | find more details on my blog | fashion blog | jeans skirt from American Apparel, green bomber jacket from Pinko, Rihanna x Stance socks\" width=\"650\" height=\"434\" /></a>\r<br/>\r<br/><a href=\"http://www.masha-sedgwick.com/?attachment_id=28472\"><img class=\"alignright wp-image-28472\" src=\"http://www.masha-sedgwick.com/wp-content/uploads/2016/05/berlin-hipster-5.jpg\" alt=\"Berlin Hipster style | find more details on my blog | fashion blog | jeans skirt from American Apparel, green bomber jacket from Pinko, Rihanna x Stance socks\" /></a>\r<br/>\r<br/><a href=\"http://www.masha-sedgwick.com/?attachment_id=28471\"><img class=\"alignright wp-image-28471\" src=\"http://www.masha-sedgwick.com/wp-content/uploads/2016/05/berlin-hipster-4.jpg\" alt=\"Berlin Hipster style | find more details on my blog | fashion blog | jeans skirt from American Apparel, green bomber jacket from Pinko, Rihanna x Stance socks\" /></a>\r<br/>\r<br/><a href=\"http://www.masha-sedgwick.com/?attachment_id=28474\"><img class=\"alignright wp-image-28474\" src=\"http://www.masha-sedgwick.com/wp-content/uploads/2016/05/berlin-hipster-7.jpg\" alt=\"Berlin Hipster style | find more details on my blog | fashion blog | jeans skirt from American Apparel, green bomber jacket from Pinko, Rihanna x Stance socks\" /></a>\r<br/>\r<br/><a href=\"http://www.masha-sedgwick.com/?attachment_id=28470\"><img class=\"alignleft wp-image-28470\" src=\"http://www.masha-sedgwick.com/wp-content/uploads/2016/05/berlin-hipster-3.jpg\" alt=\"Berlin Hipster style | find more details on my blog | fashion blog | jeans skirt from American Apparel, green bomber jacket from Pinko, Rihanna x Stance socks\" /></a>\r<br/>\r<br/><a href=\"http://www.masha-sedgwick.com/?attachment_id=28469\"><img class=\"alignleft wp-image-28469\" src=\"http://www.masha-sedgwick.com/wp-content/uploads/2016/05/berlin-hipster-2.jpg\" alt=\"Berlin Hipster style | find more details on my blog | fashion blog | jeans skirt from American Apparel, green bomber jacket from Pinko, Rihanna x Stance socks\" /></a>\r<br/>\r<br/><a href=\"http://www.masha-sedgwick.com/?attachment_id=28475\"><img class=\"alignright wp-image-28475\" src=\"http://www.masha-sedgwick.com/wp-content/uploads/2016/05/berlin-hipster-8.jpg\" alt=\"Berlin Hipster style | find more details on my blog | fashion blog | jeans skirt from American Apparel, green bomber jacket from Pinko, Rihanna x Stance socks\" /></a>\r<br/>","loves_count":0,"hypes_count":348,"items_count":3,"items":[{"name":"jacket","x":496,"y":370,"url":"http://pinko.it","brand_name":"Pinko","sl_url":"http://click.lookbook.nu/?id=34712X1515898&sref=http%3A%2F%2Flookbook.nu%2F…-American-Apparel-Skirt-Superga&url=http%3A%2F%2Fpinko.it&xcust=60494&xs=1"},{"name":"skirt","x":147,"y":329,"url":"http://www.americanapparel.net/","brand_name":"American Apparel","sl_url":"http://click.lookbook.nu/?id=34712X1515898&sref=http%3A%2F%2Flookbook.nu%2F…Skirt-Superga&url=http%3A%2F%2Fwww.americanapparel.net%2F&xcust=60494&xs=1"},{"name":"Sneakers","x":142,"y":497,"url":"http://superga-usa.com/","brand_name":"Superga","sl_url":"http://click.lookbook.nu/?id=34712X1515898&sref=http%3A%2F%2Flookbook.nu%2F…Apparel-Skirt-Superga&url=http%3A%2F%2Fsuperga-usa.com%2F&xcust=60494&xs=1"}],"user":{"id":60494,"first_name":"Masha","last_name":"Sedgwick","username":"mashasedgwick","created_at":"2009-09-01T16:45:27-04:00","name":"Masha S.","byline":"blogger on masha-sedgwick.com 来自 Berlin, Germany","byline_str":"blogger on masha-sedgwick.com","location_str":"Germany","photo":"http://cdn11.lbstatic.nu/files/users/large/60494_MASHA_FRIDA_01_061_WEB.jpg?1448103660","cover_photo_url":"http://cdn11.lbstatic.nu/files/users/cover_photos/0ea16a01-e4ca-40f8-a11a-014b7d95a69c.jpg","karma_count":403094,"looks_count":474,"fans_count":54821},"photos":{"small":"http://cdn11.lbstatic.nu/files/looks/small/2016/09/06/5014462_berlin-hipster-5.jpg?1473184854","medium":"http://cdn11.lbstatic.nu/files/looks/medium/2016/09/06/5014462_berlin-hipster-5.jpg?1473184854","large":"http://cdn11.lbstatic.nu/files/looks/large/2016/09/06/5014462_berlin-hipster-5.jpg?1473184854"}},
      navigator:"",
    };
  },
   componentWillMount() {
      this.queryRromServer(1);
  },
    getDataSource(comments) {

    var dataBlob = {};
    var sectionsID = [];
    var rowsID = [];
    var rowID = [];
    sectionsID.push("lastIndex");
    dataBlob["lastIndex"]="a";

    comments.map((item, index)=>{
        var id = item.comment.id;
        dataBlob[(index)+':' + id] = item;
        rowID[index]=(index)+':' + id;
        lastIndex=index;
    });
    rowsID.push(rowID);

    return this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionsID, rowsID);

    // return this.state.dataSource.cloneWithRows(comments);
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
  renderRow(comments, sectionID, rowID) {
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



      renderSectionHeader(sectionData, sectionID){
        return(
            <View style={[styles.rowTite,{backgroundColor:"red"}]}>
                <Text>{sectionData}</Text>
            </View>
        )
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
        renderSectionHeader={this.renderSectionHeader}
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

export default List;
