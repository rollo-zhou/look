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
      <View style={styles.flexContainer}>
       <TouchableOpacity activeOpacity={0.8} onPress={this.onSelect} style={styles.cell}>
          <Icon name="bullhorn" color={this.state.isHype?globalVariables.base:globalVariables.textBase} size={18}/>
          <Text style={styles.text}>
            {this.state.hypes_count}
          </Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity activeOpacity={0.8} onPress={this.props.onSelect} style={styles.cell}>
          <Icon name="commenting-o" color={globalVariables.textBase} size={18}/>
          <Text style={styles.text}>
            {this.props.look.comments_count}
          </Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <View style={styles.cell}>
        <Icon name="heart-o" color={this.state.isHype?globalVariables.base:globalVariables.textBase} size={18}/>
        <Text style={styles.text}>
          {this.props.look.loves_count}
        </Text>
      </View>
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
      globalVariables.queryRromServer(globalVariables.apiLookServer+(this.props.look.id)+"/hype",this.processsResults);
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
