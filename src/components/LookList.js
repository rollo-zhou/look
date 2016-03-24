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
import Icon from 'react-native-vector-icons/FontAwesome';

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
        <Icon.TabBarItemIOS

          iconName="home"
          selectedIconName="home"
          iconSize={23}
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
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS

          iconName="feed"
          selectedIconName="feed"
          iconSize={23}
          selected={this.state.selectedTab === 'feed'}
          onPress={() => {
            this.setState({
              selectedTab: 'feed',
            });
          }}>
          <View tabLabel='FEED' ref='listviewFeed' style={styles.container}>
              <LookListItem type="feed" apiTypeUrl="feed/looks" navigator={this.props.navigator} loadDate={true}/>
          </View>
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS

          iconName="safari"
          selectedIconName="safari"
          iconSize={23}
          selected={this.state.selectedTab === 'streams'}
          onPress={() => {
            this.setState({
              selectedTab: 'streams',
            });
          }}>
          <View>
          <Icon name="bullhorn" color="#4F8EF7" />
            <Text style={styles.tabText}>re-renders of the </Text>
          </View>
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS

          iconName="user"
          selectedIconName="user"
          iconSize={23}
          selected={this.state.selectedTab === 'user'}
          onPress={() => {
            this.setState({
              selectedTab: 'user',
            });
          }}>
          <View>
          <Icon name="bullhorn" color="#4F8EF7" />
            <Text style={styles.tabText}>re-renders of the </Text>
          </View>
        </Icon.TabBarItemIOS>
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
