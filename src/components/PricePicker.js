import React from 'react-native';
const {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  PickerIOS,
} = React;

import globalVariables from '../globalVariables.js';

const PickerItemIOS = PickerIOS.Item;

const PricePicker = React.createClass({

  getDefaultProps() {
    return {
      onChange() {},
      value: 100,
      label: ''
    };
  },

  render() {
    const amounts = [];

    for (let i=100; i<=900; i+=100) {
      amounts.push({ label: i + 'k', value: i });
    };

    amounts.push({ label: 'Any', value: '' });

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{this.props.label}</Text>

        <PickerIOS
          selectedValue={this.props.value}
          onValueChange={this.handleChange}>
          {amounts.map((amount) => 
            (<PickerItemIOS key={'amount-' + amount.value} value={amount.value} label={amount.label} />)
          )}
        </PickerIOS>
      </View>
    );
  },

  handleChange(value) {
    console.log('handleChange', value);
    this.props.onChange(value);
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: globalVariables.textColor,
    textAlign: 'center'
  },

  value: {
    fontSize: 22,
    color: globalVariables.green,
  },
});


export default PricePicker;
