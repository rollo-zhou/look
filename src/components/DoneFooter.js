import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  TouchableOpacity
} from 'react-native';

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import globalVariables from '../globalVariables.js';

const DoneFooter = React.createClass({
  getInitialState() {
    return {
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
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
    width:width,
    marginTop:20,
    marginBottom:0,
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
