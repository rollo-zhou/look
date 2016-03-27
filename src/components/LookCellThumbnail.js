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
import LookDetail from './LookDetail.js';

const LookCellThumbnail = React.createClass({
  getDefaultProps() {
    return {
      look: {},
      onSelect:false,
      navigator:"",
    };
  },
  render() {
    if(!this.props.look.photos){
      return false;
    }
    return(
      <TouchableOpacity activeOpacity={0.8} onPress={this.onSelect}>
          <View style={styles.row}>
            <Image source={{uri:this.props.look.photos.small}}
            style={{height: (width/3)-2,width: (width/3)-2}}/>
          </View>
      </TouchableOpacity>
    );
  },
  onSelect() {
    if(this.props.onSelect){
      this.props.onSelect(this.props.look);
    }else{
      this.props.navigator.push({
        component: LookDetail,
        title: 'Details',
        backButtonTitle:' ',
        passProps: {
          look:this.props.look,
          user:this.props.look.user,
          navigator:this.props.navigator,
        },
      });
    }
  },
});

const styles = StyleSheet.create({
  row: {
    padding: 1,
  },

});

export default LookCellThumbnail;
