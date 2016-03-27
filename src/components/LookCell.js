import React from 'react-native';
const {
  ActivityIndicatorIOS,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} = React;

import globalVariables from '../globalVariables.js';
import UserCell from './UserCell.js';
import moment from 'moment';
import LookDetail from './LookDetail.js';

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

  render() {
    if(!this.props.look.photos){
      return false;
    }


    if(this.props.userCell){
      return (<View style={styles.item}>
        <ActivityIndicatorIOS style={styles.spinner} />
         <UserCell user={this.props.look.user} onSelect={this.props.onUserSelect} navigator={this.props.navigator}/>
        <TouchableOpacity activeOpacity={0.8} onPress={this.onSelect}>
          <Image
            style={{height: (this.props.look.photo_height*width)/this.props.look.photo_width,resizeMode: 'cover',}}
            source={{uri: this.props.look.photos.medium}}/>
        </TouchableOpacity>

      </View>);
    }
    return (
    <View style={styles.item}>
      <ActivityIndicatorIOS style={styles.spinner} />

        <TouchableOpacity activeOpacity={0.8} onPress={this.onSelect}>
          <Image
            style={{height: (this.props.look.photo_height*width)/this.props.look.photo_width,resizeMode: 'cover',}}
            source={{uri: this.props.look.photos.medium}}/>
        </TouchableOpacity>

      </View>
    );
  },
  onSelect() {
    if(this.props.onSelect){
      this.props.onSelect(this.props.look);
    }else{
      this.props.navigator.push({
        component: LookDetail,
        backButtonTitle:' ',
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
    backgroundColor: 'white',
    margin: 0,
    marginTop: 0,
    marginBottom: 10,
    padding: 0,
    shadowColor: 'black',
    shadowOffset: { height: 2, width: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    // height: 260,
  },

  spinner: {
    position: 'absolute',
    left: (width/2)-20,
    top: 90
  },
});

export default LookCell;
