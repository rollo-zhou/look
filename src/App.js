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
      propertyType: 'DETACHD',
      builtRange: [1900, 2020],
      priceRange: [300, 800],
      zipCodes: ['97202'],
      bedrooms: 3,
      bathrooms: 1
    };
  },

  render() {
    let screenElement = (
      <ScreenNavigator
          title='LookBook Hot'
          component={SearchResults}
          key='search'
        />
    );

  return (
    <View style={styles.app}>
      {screenElement}
    </View>
    );
  }
});

const styles = StyleSheet.create({
  app: { width, height },
});

export default Den;
