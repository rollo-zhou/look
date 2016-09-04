import React from 'react';
import {
  ActivityIndicator,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

import globalVariables from '../globalVariables.js';
import UserCell from './UserCell.js';
import moment from 'moment';
import LookDetail from './LookDetail.js';
import LookCellFooter from './LookCellFooter.js';
const { width, height } = Dimensions.get('window');

var LookCell = React.createClass({
  getDefaultProps() {
    return {
      look: {},
      onSelect:false,
      onUserSelect:false,
      navigator:"",
      userCell:false,
    };
  },
  getInitialState() {
    return {
      needShowTime:true,
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    // return false;
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  render() {
    if(!this.props.look.photos){
      return false;
    }

    if(this.props.userCell){
      return (
        <View style={styles.item}>

        <UserCell user={this.props.look.user} needShowTime={this.props.needShowTime} time={this.props.look.created_at} title={this.props.look.title} onSelect={this.props.onUserSelect} navigator={this.props.navigator}/>
        <TouchableOpacity activeOpacity={0.8} onPress={this.onSelect} style={{backgroundColor:globalVariables.textBase2}}>
          <Image source={{uri: this.props.look.photos.medium}} style={{height: (this.props.look.photo_height*width)/this.props.look.photo_width,resizeMode: 'cover'}}/>
        </TouchableOpacity>
        <LookCellFooter look={this.props.look} onSelect={this.onSelect} navigator={this.props.navigator}/>
      </View>);
    }
    return (
    <View style={styles.item}>

        <TouchableOpacity activeOpacity={0.8} onPress={this.onSelect} style={{backgroundColor:globalVariables.textBase2}}>
          <Image source={{uri: this.props.look.photos.medium}} style={{height: (this.props.look.photo_height*width)/this.props.look.photo_width,resizeMode: 'cover'}}/>
        </TouchableOpacity>
        <LookCellFooter look={this.props.look} onSelect={this.onSelect} navigator={this.props.navigator}/>
      </View>
    );
  },

  onSelect() {
    console.log(new Date()-0);
    if(this.props.onSelect){
      this.props.onSelect(this.props.look);
    }else{
      this.props.navigator.push({
        component: LookDetail,
        backButtonTitle:' ',
        // backButtonIcon:this.state.backIcon,
        title: 'Details',
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
  item: {
    backgroundColor: globalVariables.background,
    margin: 0,
    marginTop: 0,
    marginBottom: 10,
    padding: 0,
  },

  spinner: {
    position: 'absolute',
    left: (width/2)-20,
    top: 90
  },
});

export default LookCell;
