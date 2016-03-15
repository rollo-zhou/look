import React from 'react-native';
const {
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TabBarIOS,
  PixelRatio,
} = React;

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

import ScreenNavigator from './ScreenNavigator.js';
import globalVariables from './globalVariables.js';
import SearchResults from './components/SearchResults.js';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';

const Den = React.createClass({

  getInitialState() {
    return {

    };
  },

  render() {

    return (
      <View style={styles.app}>
        <ScrollableTabView initialPage={0} style={{marginTop: 20}} >
          <View tabLabel='HOT' key="HOT"  style={{ flex: 1 }}>
          <ScreenNavigator
              title='HOT'
              component={SearchResults}
              navigationBarHidden={true}
               key="HOT"
             />
          </View>
          <View tabLabel='NEW' key="NEW"  style={{ flex: 1 }}>
            <ScreenNavigator
              title='NEW'
              component={SearchResults}
              navigationBarHidden={true}
              key="NEW"
             />
          </View>
          <View tabLabel='TOP' key="TOP"  style={{ flex: 1 }}>
            <ScreenNavigator
              title='TOP'
              component={SearchResults}
              navigationBarHidden={true}
               key="TOP"
             />
          </View>
        </ScrollableTabView>
      </View>
      );
    },
});

const styles = StyleSheet.create({
  // app: { width, height },
});

export default Den;
