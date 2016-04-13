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
import Login from './Login.js';
import User from './User.js';
import Streams from './Streams.js';
import globalVariables from '../globalVariables.js';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import Storage from './Storage.js';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

const {width, height} = Dimensions.get('window');

const LookList = React.createClass({
  getInitialState() {
    return {
      type:"hot",
      selectedTab: 'lookbook',
      mePage:"",
      feedPage:"",
      pageReload:1,
    };
  },

  getDefaultProps() {
    return {
      type:"hot"
    };
  },

  componentWillUnmount() {
    RCTDeviceEventEmitter.removeListener('Login',this._onNotification);
    RCTDeviceEventEmitter.removeListener('Logout',this._onNotification);
  },

  componentDidMount() {
    // Storage.removeItem("user");
    console.log('List-componentDidMount');
    this.getMePage();
    RCTDeviceEventEmitter.addListener('Login',this._onNotification);
    RCTDeviceEventEmitter.addListener('Logout',this._onNotification);
  },
  _onNotification(notification) {
    this.getMePage()
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    console.log('list.js-shouldComponentUpdate');
    return false;
    // return this.state.type!=nextState.type||this.state.selectedTab!=nextState.selectedTab||this.state.pageReload!=nextState.pageReload;
  },
  getMePage(){
    globalVariables.getUser((user)=>{
      if(user&&user.id){
        this.setState({
          pageReload:this.state.pageReload+1,
          mePage:(<User user={user} isMe={true} navigator={this.props.navigator}/>),
          feedPage:(<LookListItem type="feed" apiTypeUrl="feed/looks" navigator={this.props.navigator} loadDate={true} />),
        });
      }else{
        this.setState({
          pageReload:this.state.pageReload+1,
          mePage:(<Login navigator={this.props.navigator}/>),
          feedPage:(<Login navigator={this.props.navigator}/>),
        });
      }
    });
  },
  onChangeTab(index,ref){
    if(!index.i) return;
    if(index.i==0){
      if(!this.refs.listviewHot.haveLoadData()){
        this.refs.listviewHot.queryRromServer(1);
      }
    }else if(index.i==1){
      if(!this.refs.listviewNew.haveLoadData()){
        this.refs.listviewNew.queryRromServer(1);
      }
    }else if(index.i==2){
      if(!this.refs.listviewTop.haveLoadData()){
        this.refs.listviewTop.queryRromServer(1);
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
       <TabBarIOS
        tintColor={globalVariables.base}
        shadowHidden={true}
        translucent={true}
        >
        <Icon.TabBarItemIOS
          title="N·H·T"
          iconName="home"
          selectedIconName="home"
          iconSize={23}
          selected={this.state.selectedTab === 'lookbook'}
          onPress={() => {
            this.setState({
              selectedTab: 'lookbook',
            });
          }}>
          <ScrollableTabView
            initialPage={1}
            onChangeTab={this.onChangeTab}
            tabBarUnderlineColor={globalVariables.base}
            >
            <View tabLabel='NEW' style={styles.container}>
              <LookListItem ref='listviewNew' type="new" apiTypeUrl="look/new" navigator={this.props.navigator} loadDate={false}/>
            </View>
            <View tabLabel='HOT' style={styles.container}>
              <LookListItem ref='listviewHot' type="hot" apiTypeUrl="look/hot" navigator={this.props.navigator} loadDate={true}/>
            </View>
            <View tabLabel='TOP' style={styles.container}>
              <LookListItem ref='listviewTop' type="top" apiTypeUrl="look/top/week" navigator={this.props.navigator} loadDate={false}/>
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
            {this.state.feedPage}
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
          <View style={styles.container}>
            <Streams  navigator={this.props.navigator}/>
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
          <View style={styles.container}>
           {this.state.mePage}
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
});

export default LookList;
