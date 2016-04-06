import React from 'react-native';
const {
  StyleSheet,
  Image,
  Text,
  View,
} = React;

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

import globalVariables from '../globalVariables.js';

const LookListNoResults = React.createClass({
  getInitialState() {
    return {
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  render() {
    return (
      <View style={styles.view}>
        <Image source={require('../images/sad-foxy.png')} style={styles.image} />
        <Text style={styles.text}>
          Oh no! There aren’t any houses
          that match your search!
        </Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100
  },

  image: {
    flex: 1,
    width: 263,
    height: 218,
  },

  text: {
    flex: 1,
    padding: 40,
    color: globalVariables.base,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    backgroundColor: 'transparent'
  },


});

export default LookListNoResults;
