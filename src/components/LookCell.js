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

import moment from 'moment';
const { width, height } = Dimensions.get('window');

var LookCell = React.createClass({
  getDefaultProps() {
    return {
      look: {},
      onSelect:function () {},
      onSelectUser:function () {},
    };
  },

  render() {
    return (
      <View style={styles.item}>
        <ActivityIndicatorIOS style={styles.spinner} />

        <TouchableOpacity activeOpacity={0.8} onPress={this.props.onSelect}>
          <Image
            style={{height: (this.props.look.photo_height*width)/this.props.look.photo_width,resizeMode: 'cover',}}
            source={{uri: this.props.look.photos.medium}}/>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={this.props.onSelectUser}>
        <View style={styles.detailContainer}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconItem, styles.bedBoxIcons]}>
              <Image style={styles.iconImage} source={require('../images/bed-icon.png')} />
              <Text style={styles.iconText}>{this.props.look.hypes_count}</Text>
            </View>

            <View style={[styles.iconItem, styles.bedBoxIcons]}>
              <Image style={styles.iconImage} source={require('../images/bath-icon.png')} />
              <Text style={styles.iconText}>{this.props.look.comments_count}</Text>
            </View>

            <View style={styles.iconItem}>
              <Image style={styles.iconImage} source={require('../images/ruler-icon.png')} />
              <Text style={styles.iconText}>{this.props.look.loves_count}</Text>
            </View>

            <View style={styles.iconItem}>
              <Image style={styles.iconImage} source={require('../images/crane-icon.png')} />
              <Text style={styles.iconText}>{this.props.look.items_count}</Text>
            </View>
          </View>
        </View>
        </TouchableOpacity>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    margin: 5,
    marginTop: 5,
    marginBottom: 5,
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

  image: {
    height: 260,
    resizeMode: 'cover',
  },

  priceContainer: {
    position: 'absolute',
    backgroundColor: globalVariables.green,
    padding: 5,
    top: 6,
    left: 0,
    height: 30,
    shadowColor: 'black',
    shadowOffset: {height: 2, width: 1  },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },

  dateContainer: {
    backgroundColor: globalVariables.orange,
  },

  priceText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  dateText: {
    fontSize: 13,
  },

  detailContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    height: 50,
    padding: 10
  },

  addressText: {
    color: globalVariables.textColor,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center'
  },

  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  iconItem: {
    flex: 3,
    justifyContent: 'center',
    flexDirection: 'row',
  },

  iconImage: {
    width: 24,
    height: 24,
  },

  iconText: {
    fontSize: 14,
    color: globalVariables.textColor,
    lineHeight: 20,
    marginLeft: 3,
  },

  bedBoxIcons: {
    flex: 2,
  },

});

export default LookCell;
