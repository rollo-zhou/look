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
import LookDetail from './LookDetail.js';

const LookCellThumbnail = React.createClass({
  getDefaultProps() {
    return {
      look: {},
      onSelect:false,
      navigator:"",
    };
  },
  getInitialState() {
    return {
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  render() {
    if(!this.props.look.photos){
      return false;
    }
    return(
      <TouchableOpacity activeOpacity={0.8} onPress={this.onSelect}>
          <View  style={styles.row}>
            <Image source={{uri:this.props.look.photos.small}}
            style={{height: (width/3)-1,width: (width/3)-1}}/>
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
    // flex:1,
    margin: 0.5,
    backgroundColor:globalVariables.textBase2,
    // backgroundColor:globalVariables.base,
  },

});

export default LookCellThumbnail;
