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
import User from './User.js';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import Storage from './Storage.js';
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
    userHyped:{},
    user:{}
  },
  componentDidMount() {
    if(!this.props.look){
      return false;
    }
    Storage.getItem('user-hyped')
    .then((hyped)=>{
      if(!hyped)return;
        this.module.userHyped=hyped;
        this.setState({isHype:!!hyped[this.props.look.id]});
      }
    );
  },

  render() {
    if(!this.props.look){
      return false;
    }

    return (
    <View style={styles.commentContent}>
     <TouchableOpacity activeOpacity={0.8} onPress={this.onSelect}>
      <View style={styles.commentBody}>
        <Icon name="bullhorn" color={this.state.isHype?"#d54":"#666"}/>
        <Text style={styles.userName}>
          {this.state.hypes_count}
        </Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity activeOpacity={0.8} onPress={this.props.onSelect}>
      <View style={styles.commentBody}>
        <Icon name="commenting-o"/>
        <Text style={styles.userName}>
          {this.props.look.comments_count}
        </Text>
      </View>
      </TouchableOpacity>
    </View>
    );
  },
  onSelect() {
    if(!this.module.userHyped) return;
    if(this.props.look && this.props.look.id){
      var hypes_count=this.state.isHype?this.state.hypes_count-1:this.state.hypes_count+1
      this.setState({
        hypes_count:hypes_count,
        isHype:!this.state.isHype,
      });
      globalVariables.queryRromServer(globalVariables.apiLookServer+(this.props.look.id),this.processsResults);
    }
  },
  processsResults(data) {
    if (data && data.status=="unhyped") {
      delete this.module.userHyped[this.props.look.id];
      this.setState({
        hypes_count:this.state.hypes_count-1,
        isHype:false,
      });
    }else if(data && data.status=="hyped") {
      this.module.userHyped[this.props.look.id]=this.props.look.id;
      this.setState({
        hypes_count:this.state.hypes_count+1,
        isHype:true,
      });
    }

    if (data && data.status){
      Storage.setItem('user-hyped',this.module.userHyped)
      .then((hyped)=>{
        }
      );
    }
  }
});

const styles = StyleSheet.create({
  commentContent: {
    padding: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
     backgroundColor: globalVariables.background,
    //backgroundColor: "transparent",
    opacity:0.97,
  },
  userName: {
    // fontWeight: "400",
    color:"#666",
    fontSize:12,
  },
  commentBody: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
  },
});

export default LookCellFooter;
