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
import LookCellThumbnail from './LookCellThumbnail.js';
import DoneFooter from './DoneFooter.js';
import LookCell from './LookCell.js';

const UserLookList = React.createClass({
  getInitialState() {
    return {
      searchPending: true,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      looks: [],
      uid:0,
      user: {},
      next:1,
      showImagType:"thumb",
      listRowStyle:styles.thumb
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
    };
  },
  componentDidMount() {
    // console.log(this.props.search);
    this.processResults();
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
        dataSource:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        listRowStyle:style,
        showImagType:showImagType,
      });
      this.setState({
        dataSource: this.getDataSource(this.state.looks),
      });
    }
  },

  renderFooter() {
    if (!this.state.next && !this.state.searchPending) {
      return (
       <DoneFooter/>
      );
    }

    return (<ActivityIndicatorIOS style={styles.scrollSpinner} />);
  },

  onEndReached() {
    console.log('onEndReached');
    if (this.state.next && !this.state.searchPending) {
      this.queryRromServer(this.props.uid, this.state.next, this.state.form);
    }
  },

  renderRow(looks) {
     if(this.state.showImagType=="list"){
        return (<LookCell
            look={looks.look}
            navigator={this.props.navigator}
            onUserSelect={function(){}}
          />);
      }
     return  (
      <LookCellThumbnail look={looks.look}
          navigator={this.props.navigator}
          onUserSelect={function(){}}
      />);
  },

  render() {
    if (!this.state.searchPending && !this.state.looks.length) {
    }

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
  },

  processResults(data) {
    if(!data){
      data=this.props;
    }
    this.setState({
      user: data.user,
      searchPending: false,
      form: data.form
    });
  },

  queryRromServer(page) {
    globalVariables.queryRromServer(globalVariables.apiUserServer+this.props.user.id+'/'+this.props.from+'?page='+(page||1),this.processsResults);
  },

  processsResults(data) {
    if (!data||!data.looks||!data.looks.length) return;

    const newLooks = this.state.looks.concat(data.looks);
    this.setState({
      looks: newLooks,
      searchPending: false,
      dataSource: this.getDataSource(newLooks),
      form: data.form,
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

  list: {

  },
  thumb: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  scrollSpinner: {
    marginVertical: 20,
  },
});

export default UserLookList;
