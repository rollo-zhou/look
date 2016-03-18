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

const LookCellThumbnail = React.createClass({
  getDefaultProps() {
    return {
      photo:""
    };
  },
  render() {
    return(
      <TouchableOpacity activeOpacity={0.7} >
          <View style={styles.row}>
            <Image source={{uri:this.props.photo}}
            style={{height: (width/3)-2,width: (width/3)-2}}/>
          </View>
      </TouchableOpacity>
    );
  },
});

const styles = StyleSheet.create({
  row: {
    padding: 1,
  },

});

export default LookCellThumbnail;
