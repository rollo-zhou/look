import React from 'react-native';
const {
  ActivityIndicatorIOS,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  TouchableOpacity
} = React;

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import globalVariables from '../globalVariables.js';

const DoneFooter = React.createClass({
  render() {
     return(
      <View style={styles.doneView}>
          <Image source={require('../images/foxy.png')} style={styles.doneImage} />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  doneView: {
    flexDirection: 'row',
    justifyContent: 'center'
  },

  doneImage: {
    width: 302 / 5,
    height: 252 / 5
  },
});

export default DoneFooter;
