import React from 'react';
import {
  ActivityIndicator,
  ListView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  TabBarIOS,
  Dimensions,
} from 'react-native';

import globalVariables from '../globalVariables.js';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import LeaderListItem from './LeaderListItem.js';

const {width, height} = Dimensions.get('window');

const LeaderList = React.createClass({
  getInitialState() {
    return {
      type:"hot",
      selectedTab: 'lookbook',
      pageReload:1,
    };
  },

  getDefaultProps() {
    return {
      type:"hot"
    };
  },


  // shouldComponentUpdate: function(nextProps, nextState) {
  //   console.log('list.js-shouldComponentUpdate');
  //   // return false;
  //   return this.state.type!=nextState.type||this.state.selectedTab!=nextState.selectedTab||this.state.pageReload!=nextState.pageReload;
  // },

  onChangeTab(index,ref){
    // if(!index.i) return;
    if(index.i==0){
      if(this.refs.listviewTODAY&&!this.refs.listviewTODAY.haveLoadData()){
        this.refs.listviewTODAY.queryRromServer(1);
      }
    }else if(index.i==1){
      if(this.refs.listviewWEEK&&!this.refs.listviewWEEK.haveLoadData()){
        this.refs.listviewWEEK.queryRromServer(1);
      }
    }else if(index.i==2){
      if(this.refs.listviewMONTH&&!this.refs.listviewMONTH.haveLoadData()){
        this.refs.listviewMONTH.queryRromServer(1);
      }
    }else if(index.i==3){
      if(this.refs.listviewYEAR&&!this.refs.listviewYEAR.haveLoadData()){
        this.refs.listviewYEAR.queryRromServer(1);
      }
    }
  },
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   return nextState.type!=this.state.type|| nextState.selectedTab!=this.state.selectedTab;
  //   // return JSON.stringify(nextState)!=JSON.stringify(this.state);
  // },
  render() {
    console.log('List-render');
    return (
          <ScrollableTabView
            initialPage={0}
            onChangeTab={this.onChangeTab}
            tabBarActiveTextColor={globalVariables.base}
            tabBarInactiveTextColor={globalVariables.textBase}
            tabBarUnderlineColor={globalVariables.background}
            tabBarUnderlineColor={globalVariables.base}
            tabBarTextStyle={{fontWeight:'400'}}
            >
            <View tabLabel='TODAY' style={styles.container}>
              <LeaderListItem ref='listviewTODAY'  apiTypeUrl="leader?period=today" navigator={this.props.navigator} loadDate={true}/>
            </View>
            <View tabLabel='WEEK' style={styles.container}>
              <LeaderListItem ref='listviewWEEK'  apiTypeUrl="leader?period=this-week" navigator={this.props.navigator} loadDate={false}/>
            </View>
            <View tabLabel='MONTH' style={styles.container}>
              <LeaderListItem ref='listviewMONTH'  apiTypeUrl="leader?period=this-month" navigator={this.props.navigator} loadDate={false}/>
            </View>
            <View tabLabel='YEAR' style={styles.container}>
              <LeaderListItem ref='listviewYEAR'  apiTypeUrl="leader?period=this-year" navigator={this.props.navigator} loadDate={false}/>
            </View>
          </ScrollableTabView>
    );
  },

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 20,
    backgroundColor: globalVariables.background,
  },
});

export default LeaderList;
