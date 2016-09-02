import React from 'react';
import {
  NavigatorIOS,
  StyleSheet
} from 'react-native';

import globalVariables from './globalVariables.js';
import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

const ScreenNavigator = React.createClass({
  getDefaultProps() {
    return {
      title: '',
      component: null
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        barTintColor={globalVariables.background}
        tintColor={globalVariables.textBase}
        titleTextColor={globalVariables.textBase}
        initialRoute={this.props}
        shadowHidden={true}
        translucent={true}
      />
    );
  },
});

const styles = StyleSheet.create({
  container: {
    width,
    height
  },
});

export default ScreenNavigator;
