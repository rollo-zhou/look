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
      uid: 0,
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
    };
  },
  showImagListOrThumb(type){
    var isThumb=type=='thumb'?true:false;
    this.setState({isThumb:isThumb});
    this.refs.UserLookList.setShowImagType(type);
  },

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.mainSection}>

          <TouchableOpacity activeOpacity={0.8} onPress={() => this.showImagListOrThumb("thumb")} style={styles.cell}>
            <Icon name="grid" color={this.state.isThumb?globalVariables.base:globalVariables.textBase} size={30}/>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => this.showImagListOrThumb("list")} style={styles.cell}>
              <Icon name="navicon-round" color={this.state.isThumb?globalVariables.textBase:globalVariables.base} size={30}/>
          </TouchableOpacity>
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
    paddingTop: 54,
    backgroundColor: globalVariables.background,
  },
  cell: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    color:globalVariables.base,
    fontWeight:'600',
  },
  mainSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  separator: {
    backgroundColor: globalVariables.textBase2,
    height: 20 ,
    width:1,
  },
});

export default UserLooked;
