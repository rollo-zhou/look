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
import LookListItem from './LookListItem.js';
import DoneFooter from './DoneFooter.js';

const Streams = React.createClass({
  getInitialState() {
    return {
      streams:[],
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
  },
  getDefaultProps() {
    return {
      navigator:""
    };
  },
  componentDidMount() {
      this.queryRromServer(1);
  },

  getDataSource(streams) {
    return this.state.dataSource.cloneWithRows(streams);
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
    name=name.toLocaleLowerCase();
    this.props.navigator.push({
        component: LookListItem,
        backButtonTitle:' ',
        title: name,
        passProps: {
          apiTypeUrl:"streams/"+name,
          urlPageType:"?",
          loadDate:{true},
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
            style={{height: (width/3)-2,width: (width/3)-2}}/>
          </View>
      </TouchableOpacity>
    );
  },

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
      />
    );
  },

  queryRromServer(page) {
    globalVariables.queryRromServer(globalVariables.apiServer+"streams",this.processsResults);
  },

  processsResults(data) {
    if (!data||!data.streams||!data.streams.length) return;

    var newStreams= this.state.streams.concat(data.streams);

    this.setState({
      streams: newStreams,
      dataSource: this.getDataSource(newStreams),
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

export default Streams;
