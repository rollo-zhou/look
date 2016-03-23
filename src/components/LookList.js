import React from 'react-native';
const {
  ActivityIndicatorIOS,
  ListView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  TabBarIOS,
} = React;


import LookListItem from './LookListItem.js';
import globalVariables from '../globalVariables.js';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';

const LookList = React.createClass({
  getInitialState() {
    return {
      type:"hot",
      selectedTab: 'lookbook',
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
       <TabBarIOS
        tintColor={globalVariables.green}

        shadowHidden={true}
        translucent={true}
        >

        <TabBarIOS.Item
          title="LookBook"
          iconName="ios-home-outline"
          selectedIconName="ios-home"
          selected={this.state.selectedTab === 'lookbook'}
          onPress={() => {
            this.setState({
              selectedTab: 'lookbook',
            });
          }}>
          <ScrollableTabView initialPage={0} style={{marginTop: 20}} >
            <View tabLabel='HOT' ref='listviewHot' style={styles.container}>
              <LookListItem type="hot" apiTypeUrl="look/hot" navigator={this.props.navigator} loadDate={true}/>
            </View>
            <View tabLabel='NEW' ref='listviewNew' style={styles.container}>
              <LookListItem type="new" apiTypeUrl="look/new" navigator={this.props.navigator} loadDate={true}/>
            </View>
            <View tabLabel='TOP' ref='listviewTop' style={styles.container}>
              <LookListItem type="top" apiTypeUrl="look/top/week" navigator={this.props.navigator} loadDate={true}/>
            </View>
          </ScrollableTabView>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Feed"
          selected={this.state.selectedTab === 'feed'}
          onPress={() => {
            this.setState({
              selectedTab: 'feed',
            });
          }}>
          <View tabLabel='FEED' ref='listviewFeed' style={styles.container}>
              <LookListItem type="feed" apiTypeUrl="feed/looks" navigator={this.props.navigator} loadDate={true}/>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Me"
          selected={this.state.selectedTab === 'me'}
          onPress={() => {
            this.setState({
              selectedTab: 'me',
            });
          }}>
          <View>
            <Text style={styles.tabText}>re-renders of the </Text>
          </View>
        </TabBarIOS.Item>
      </TabBarIOS>

    );
  },

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 64,
    backgroundColor: globalVariables.background,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    // color: 'white',
    margin: 50,
  },
});

export default LookList;
