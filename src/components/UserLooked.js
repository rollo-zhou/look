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
import UserInfo from './UserInfo.js';
import Icon from 'react-native-vector-icons/Ionicons';
import UserLookList from './UserLookList.js';

const UserLooked = React.createClass({
  getInitialState() {
    return {
      isThumb:true,
      counts:0,
    };
  },
  getDefaultProps() {
    return {
      user: {
        uid: 0,
        photo:"",
        name:"",
        byline:"",
        fans_count:"",
        looks_count:"",
        karma_count:""
      },
      from:"hyped_looks",
      navigator:"",
      counts:0,
    };
  },
  showImagListOrThumb(type){
    var isThumb=type=='thumb'?true:false;
    this.setState({isThumb:isThumb});
    this.refs.UserLookList.setShowImagType(type);
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  render() {
    return(
      <View style={styles.container}>
        <View style={styles.mainSection}>

          <TouchableOpacity activeOpacity={0.8} onPress={() => this.showImagListOrThumb("thumb")} style={styles.cell}>
            <Icon name="grid" color={this.state.isThumb?globalVariables.base:globalVariables.textBase} size={25}/>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.showImagListOrThumb("list")} style={styles.cell}>
              <Icon name="navicon-round" color={this.state.isThumb?globalVariables.textBase:globalVariables.base} size={27}/>
          </TouchableOpacity>
          <View style={styles.separator} />
          <View style={styles.cell} >
              <Text style={styles.text}>{this.props.counts}</Text>
          </View>
        </View>
        <UserLookList
          user={this.props.user}
          uid={this.props.uid}
          from={this.props.from}
          navigator={this.props.navigator}
          needShowTime={false}
          ref="UserLookList"/>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 44,
    backgroundColor: globalVariables.background,
  },
  cell: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    color:globalVariables.base,
    fontWeight:'600',
  },
  mainSection: {
    flexDirection: 'row',
    alignItems:"center",
    justifyContent: 'center',
    height:44,
  },
  separator: {
    backgroundColor: globalVariables.textBase2,
    height: 15 ,
    width:0.5,
  },
  lookedCounts: {
    width: 35,
    height: 25,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: globalVariables.base,
    alignItems:'center',
    // justifyContent: "center",
    // marginRight:10,
  },
});

export default UserLooked;
