import React from 'react';
import {
  ActivityIndicatorIOS,
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
import LookListItem from './LookListItem.js';
import DoneFooter from './DoneFooter.js';

const Streams = React.createClass({
  getInitialState() {
    return {
      streams:[],
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      next:true,
      searchPending:true,
    };
  },
  getDefaultProps() {
    return {
      navigator:""
    };
  },
  componentWillMount() {
      this.queryRromServer(1);
  },

  getDataSource(streams) {
    return this.state.dataSource.cloneWithRows(streams);
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  renderFooter() {
    if (!this.state.next && !this.state.searchPending) {
      return (
       <DoneFooter/>
      );
    }
    return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
  },
  onSelect(name){
    // name=name.toLocaleLowerCase();
    this.props.navigator.push({
        component: LookListItem,
        backButtonTitle:' ',
        title: name,
        passProps: {
          apiTypeUrl:"streams/"+name,
          urlPageType:"?",
          loadDate:{true},
          needPaddingTop:{true},
          navigator:this.props.navigator,
        },
      });
  },
  renderRow(streams) {
    if(!streams||!streams.backgrounds||!streams.backgrounds[0]){
      return false;
    }
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={()=>this.onSelect(streams.name)}>
          <View style={styles.row}>
            <Image source={{uri:streams.backgrounds[0]}}
            style={{height: (width/2)-10,width: (width/2)-10,backgroundColor:globalVariables.textBase2}}/>
            <View style={styles.content}>
            <Text style={styles.contentText}>{streams.name}</Text>
            </View>
          </View>
      </TouchableOpacity>
    );
  },

  render() {
    return (
      <ListView
        contentContainerStyle={styles.thumb}
        dataSource={this.state.dataSource}
        renderFooter={this.renderFooter}
        renderRow={this.renderRow}
        onEndReachedThreshold={10}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps={false}
        showsVerticalScrollIndicator={true}
        style={styles.container}
      />
    );
  },
  onEndReached() {
    if (this.state.next && !this.state.searchPending) {
      this.setState({ searchPending: true });
      this.queryRromServer(this.state.pageNo);
    }
  },
  queryRromServer(page) {
    globalVariables.queryRromServer(globalVariables.apiServer+"streams",this.processsResults);
  },

  processsResults(data) {
    if (!data||!data.streams||!data.streams.length){
      this.setState({
        searchPending: false,
        next:false,
      });
      return;
    }
    var newStreams= this.state.streams.concat(data.streams);

    this.setState({
      streams: newStreams,
      dataSource: this.getDataSource(newStreams),
      searchPending: false,
      next:false,
    });
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: globalVariables.background,
    // margin:10,
    marginBottom:44,
  },
  thumb: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  row: {
    flex: 1,
    margin: 5,
    flexDirection: 'column',
    alignItems:"center",
    // backgroundColor:globalVariables.textBase2,
  },
  content:{
    flex: 1,
    justifyContent: "center",
    height: 40,
    // marginBottom:10,
  },
  contentText:{
    fontWeight: "600",
    // fontSize:16,
    color:globalVariables.base,
  },
  scrollSpinner: {
    marginVertical: 36,
  },
});

export default Streams;
