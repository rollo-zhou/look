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
          <Text style={styles.ILoveYou}>- I Love You -</Text>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  doneView: {
    flexDirection: 'row',
    justifyContent: 'center',
    height:40,

  },
  ILoveYou: {
    paddingTop:10,
    fontSize: 10,
    color: "#d8d2d6",
    // fontWeight: "400",
    // lineHeight: 18
  },
  doneImage: {
    width: 302 / 5,
    height: 252 / 5
  },
});

export default DoneFooter;
