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

const Den = React.createClass({

  getInitialState() {
    return {

    };
  },

  render() {

    return (
      <View style={styles.app}>
          <ScreenNavigator
              title='HOT'
              component={SearchResults}
              navigationBarHidden={true}
             />
      </View>
      );
    },
});

const styles = StyleSheet.create({
  // app: { width, height },
});

export default Den;
