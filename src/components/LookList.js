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
  Dimensions,
} = React;


import LookListItem from './LookListItem.js';
import globalVariables from '../globalVariables.js';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
const {width, height} = Dimensions.get('window');

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
          title="H-N-T"
          iconName="home"
          selectedIconName="home"
          iconSize={23}
          selected={this.state.selectedTab === 'lookbook'}
          onPress={() => {
            this.setState({
              selectedTab: 'lookbook',
            });
          }}>
          <ScrollableTabView initialPage={0}>
            <View tabLabel=' ' ref='listviewHot' style={styles.container}>
              <LookListItem type="hot" apiTypeUrl="look/hot" navigator={this.props.navigator} loadDate={true}/>
            </View>
            <View tabLabel=' ' ref='listviewNew' style={styles.container}>
              <LookListItem type="new" apiTypeUrl="look/new" navigator={this.props.navigator} loadDate={true}/>
            </View>
            <View tabLabel=' ' ref='listviewTop' style={styles.container}>
              <LookListItem type="top" apiTypeUrl="look/top/week" navigator={this.props.navigator} loadDate={true}/>
            </View>
          </ScrollableTabView>
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="Feed"
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
            <LookListItem type="feed" apiTypeUrl="feed/looks" navigator={this.props.navigator} loadDate={true} />
          </View>
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="Streams"
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
          title="Me"
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

  navigatorBar:{
    height: 44,
    width:width,
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.98)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: 0,
    // backgroundColor: "transparent",
    // opacity:0.99,
  },
});

export default LookList;
