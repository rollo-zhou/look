//🌚🌝😩😤😫

import React from 'react-native';
const {
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TabBarIOS,
  PixelRatio,
  StatusBar,
} = React;

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

import ScreenNavigator from './ScreenNavigator.js';
import globalVariables from './globalVariables.js';
import LookList from './components/LookList.js';
import Icon from 'react-native-vector-icons/FontAwesome';

const Den = React.createClass({

  getInitialState() {
    return {
      backIcon:""
    };
  },
  componentWillMount: function() {
    Icon.getImageSource('angle-left', 25).then((source) =>this.setState({ backIcon: source }))
  },
  render() {
    StatusBar.setHidden(true);
    if(!this.state.backIcon)return false;

    return (
      <View style={styles.app}>
          <ScreenNavigator
              title='HOT'
              backButtonTitle=' '
              component={LookList}
              backButtonIcon={this.state.backIcon}
               // leftButtonIcon={this.state.backIcon}
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
