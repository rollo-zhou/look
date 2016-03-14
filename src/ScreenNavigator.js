import React from 'react-native';
const {
  NavigatorIOS,
  StyleSheet
} = React;

import globalVariables from './globalVariables.js';
import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

const ScreenNavigator = React.createClass({
  getDefaultProps() {
    return {
      title: '',
      component: null
    };
  },
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        tintColor={globalVariables.green}
        initialRoute={this.props}
        shadowHidden={true}
        translucent={true}
        titleTextColor={globalVariables.textColor}
      />
    );
  },
});

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 0
  },
});

export default ScreenNavigator;
