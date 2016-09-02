//🌚🌝😩😤😫
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TabBarIOS,
  PixelRatio,
  StatusBar,
} from 'react-native';

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

import ScreenNavigator from './ScreenNavigator.js';
import globalVariables from './globalVariables.js';
import LookList from './components/LookList.js';

const Den = React.createClass({
  getInitialState() {
    return {
    };
  },
  render() {
    StatusBar.setHidden(true);
    return (
      <View style={styles.app}>
          <ScreenNavigator
              title='HOT'
              backButtonTitle=' '
              component={LookList}
              // backButtonIcon={this.state.backIcon}
               // leftButtonIcon={this.state.backIcon}
              navigationBarHidden={true}
             />
      </View>
      );
    },
});

const styles = StyleSheet.create({
  app: { width, height },
});

export default Den;
