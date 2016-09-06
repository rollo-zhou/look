import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import globalVariables from '../globalVariables.js';
import LookCellThumbnail from './LookCellThumbnail.js';
import DoneFooter from './DoneFooter.js';
import LookCell from './LookCell.js';

const UserLookList = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      looks: [],
      uid:0,
      user: {},
      next:true,
      pageNo:1,
      showImagType:"thumb",
      listRowStyle:styles.thumb,
      refreshing:false,
      animating:true
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
      from:"looks",
      renderHeader:function(){},
      navigator:"",
      isMe:false,
      listCount:-1,
      needShowTime:true,
    };
  },
  componentWillMount() {
    // console.log(this.props.search);

    this.queryRromServer();
  },

  getDataSource(looks) {
    return this.state.dataSource.cloneWithRows(looks);
  },
  setShowImagType(type){
    if(type!=this.state.showImagType){
      var style=styles.thumb;
      var showImagType="thumb";
      if(type=="list"){
        style=styles.list;
        showImagType="list";
      }

      this.setState({
        dataSource:this.getDataSource([]),
        listRowStyle:style,
        showImagType:showImagType
      });
      var _this=this;
      setTimeout(function(){
        _this.setState({
        dataSource: _this.getDataSource(_this.state.looks)
      });
      }, 0);

    }
  },

  renderFooter() {
    if (!this.state.next) {
      return (
       <DoneFooter/>
      );
    }
    return <ActivityIndicator style={styles.scrollSpinner} animating={this.state.animating}/>;
  },

  // shouldComponentUpdate: function(nextProps, nextState) {
  //   return JSON.stringify(nextState)!=JSON.stringify(this.state);
  // },
  renderRow(looks) {
     if(this.state.showImagType=="list"){
        if(this.props.from=="looks"){
          return (<LookCell
              look={looks.look}
              navigator={this.props.navigator}
              onUserSelect={function(){}}
              needShowTime={this.props.needShowTime}
              userCell={true}
            />);
        }else{
          return (<LookCell
              look={looks.look}
              navigator={this.props.navigator}
              needShowTime={this.props.needShowTime}
              userCell={true}
            />);
        }
      }
     return  (
      <LookCellThumbnail look={looks.look}
          navigator={this.props.navigator}
          onUserSelect={function(){}}
      />);
  },

  render() {
    if(this.props.isMe){
      return (
          <ListView
            ref='listview'
            contentContainerStyle={this.state.listRowStyle}
            dataSource={this.state.dataSource}
            renderFooter={this.renderFooter}
            renderRow={this.renderRow}
            onEndReached={this.onEndReached}
            renderHeader={this.props.renderHeader}
            onEndReachedThreshold={10}
            // initialListSize={15}
            pageSize={15}
            scrollRenderAheadDistance={10}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps={false}
            showsVerticalScrollIndicator={true}
            style={styles.container}
            refreshControl={
            <RefreshControl
            onRefresh={this.reFreshQueryRMLS}
            tintColor='#aaaaaa'
            refreshing={this.state.refreshing}
            progressBackgroundColor='#aaaaaa'
          />}
          />
      );
    }else{
      return (
        <ListView
          ref='listview'
          contentContainerStyle={this.state.listRowStyle}
          dataSource={this.state.dataSource}
          renderFooter={this.renderFooter}
          renderRow={this.renderRow}
          onEndReached={this.onEndReached}
          renderHeader={this.props.renderHeader}
          onEndReachedThreshold={10}
          // initialListSize={15}
          pageSize={15}
          scrollRenderAheadDistance={10}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps={false}
          showsVerticalScrollIndicator={true}
          style={styles.container}
        />
    );
    }

  },

  onEndReached() {
    if (this.state.next && !this.state.animating&& !this.state.refreshing) {
      this.setState({ animating: true ,refreshing:false});
      this.queryRromServer(this.state.pageNo);
    }
  },

  reFreshQueryRMLS(page) {
    if (!this.state.animating&& !this.state.refreshing) {
      this.setState({ refreshing: true ,animating: false ,pageNo:1});
      if(this.refs.listview.refs.userInfo){
        this.refs.listview.refs.userInfo.queryRromServer();
      }
      this.queryRromServer(1);
    }
  },

  queryRromServer(page) {
    var _this=this;
    globalVariables.queryRromServer(globalVariables.apiUserServer+this.props.user.id+'/'+this.props.from+'?page='+(page||1),this.processsResults,{
      errorFunc:function(){
        _this.setState({
          refreshing:false,
          animating:false,
        });
      }
    });
  },

  processsResults(data) {
    if (!data||!data.looks||!data.looks.length){
      this.setState({
        animating: false,
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

    var next=true;
    if(this.props.listCount>0&&newLooks.length>=this.props.listCount){
      next=false;
    }
    this.setState({
      looks: newLooks,
      animating: false,
      refreshing:false,
      dataSource: this.getDataSource(newLooks),
      form: data.form,
      pageNo: this.state.pageNo+1,
      next:next,
    });
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: -10,
    backgroundColor: globalVariables.background,
    // backgroundColor: globalVariables.textBase,
  },

  list: {

  },
  thumb: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },

  scrollSpinner: {
    marginVertical: 20,
    width:width,
  },


  row: {
    margin: 0.5,
    backgroundColor:globalVariables.textBase2,
  },
});

export default UserLookList;
