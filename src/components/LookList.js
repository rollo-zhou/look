import React from 'react-native';
const {
  ActivityIndicatorIOS,
  ListView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  RefreshControl
} = React;


import LookListItem from './LookListItem.js';
import globalVariables from '../globalVariables.js';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';

const _this="";

const LookList = React.createClass({
  getInitialState() {
    return {
      type:"hot"
    };
  },

  getDefaultProps() {
    return {
      type:"hot"
    };
  },

  componentDidMount() {
    // console.log(this.props.search);
  },

  render() {
    return (
      <ScrollableTabView initialPage={0} style={{marginTop: 20}} >
          <View tabLabel='HOT' ref='listviewHot' style={styles.container}>
            <LookListItem type="hot" loadDate={true}/>
          </View>
          <View tabLabel='NEW' ref='listviewNew' style={styles.container}>
            <LookListItem type="new" loadDate={false}/>
          </View>
          <View tabLabel='TOP' ref='listviewNew' style={styles.container}>
            <LookListItem type="top" loadDate={false}/>
          </View>
        </ScrollableTabView>
    );
  },

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 64,
    backgroundColor: globalVariables.background,
  },
});

export default LookList;
