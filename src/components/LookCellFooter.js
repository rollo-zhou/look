import React from 'react';
import {
  ActivityIndicatorIOS,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

import globalVariables from '../globalVariables.js';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import Storage from './Storage.js';
import Login from './Login.js';
const { width, height } = Dimensions.get('window');

var LookCellFooter = React.createClass({
  getDefaultProps() {
    return {
     look: {},
     onSelect:()=>{},
    };
  },
  getInitialState() {
    return {
      hypes_count: this.props.look.hypes_count||0,
      isHype:false,
    };
  },
  module:{
    userHyped:null,
    user:null,
  },
  componentWillMount() {
    if(!this.props.look){
      return false;
    }
    // globalVariables.getUser((user)=>{
    //   if(!user)return;
    //     this.module.user=user;
    //   }
    // );
    globalVariables.getUserHyped((hyped)=>{
      if(!hyped)return;
        this.module.userHyped=hyped;
        this.setState({isHype:!!hyped[this.props.look.id]});
      }
    );
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return JSON.stringify(nextState)!=JSON.stringify(this.state);
  },
  render() {
    if(!this.props.look){
      return false;
    }

    return (
      <View style={styles.flexContainer}>
       <TouchableOpacity activeOpacity={0.8} onPress={this.onSelect} style={styles.cell}>
          <Icon name="speakerphone" color={this.state.isHype?globalVariables.base:globalVariables.textBase} size={18}/>
          <Text style={styles.text}>
            {this.state.hypes_count}
          </Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity activeOpacity={0.8} onPress={this.props.onSelect} style={styles.cell}>
          <Icon name="ios-chatbubble-outline" color={globalVariables.textBase} size={20}/>
          <Text style={styles.text}>
            {this.props.look.comments_count}
          </Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <View style={styles.cell}>
        <Icon name="ios-heart-outline" color={this.state.isHype?globalVariables.base:globalVariables.textBase} size={20}/>
        <Text style={styles.text}>
          {this.props.look.loves_count}
        </Text>
      </View>
    </View>
    );
  },
  onSelect() {
     globalVariables.getUser((user)=>{
      if(!user){
        this.props.navigator.push({
          component: Login,
          backButtonTitle:' ',
          // backButtonIcon:this.state.backIcon,
          title: 'Login',
          passProps: {
            navigator:this.props.navigator,
          },
        });
        return;
      }else if(this.props.look && this.props.look.id){
        var hypes_count=this.state.isHype?this.state.hypes_count-1:this.state.hypes_count+1
        this.setState({
          hypes_count:hypes_count,
          isHype:!this.state.isHype,
        });
        globalVariables.queryRromServer(globalVariables.apiLookServer+(this.props.look.id)+"/hype",this.processsResults);
      }
    });
  },
  processsResults(data) {
    if (data && data.status=="unhyped") {
      delete this.module.userHyped[this.props.look.id];
      if(this.state.isHype){
        this.setState({
          hypes_count:this.state.hypes_count-1,
          isHype:false,
        });
      }
    }else if(data && data.status=="hyped") {
      this.module.userHyped[this.props.look.id]=this.props.look.id;
      if(!this.state.isHype){
        this.setState({
          hypes_count:this.state.hypes_count+1,
          isHype:true,
        });
      }
    }

    if (data && data.status){
      globalVariables.setUserHyped(this.module.userHyped);
    }
  }
});

const styles = StyleSheet.create({
  flexContainer: {
      flexDirection: 'row',
      opacity:0.97,
      padding: 5,
      backgroundColor: globalVariables.background,
      height:45,
  },
  cell: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    color:globalVariables.textBase,
    fontSize:12,
    marginLeft:10,
  },
  separator: {
    backgroundColor: globalVariables.textBase2,
    height: 15 ,
    width:0.5,
    marginVertical: 10,
  },
  separator2: {
    backgroundColor: globalVariables.textBase2,
    height: 0.5 ,
    width:width-20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LookCellFooter;
