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
import Icon from 'react-native-vector-icons/Ionicons';

const UserInfo = React.createClass({
  getInitialState() {
    return {
      searchPending: true,
      user:{},
      uid:0,
      isThumb:true,
    };
  },

  getDefaultProps() {
    return {
      uid: 0,
      user: {
        id:0,
        photo:"",
        name:"",
        byline:"",
        fans_count:"",
        looks_count:"",
        karma_count:""
      },
      showImagListOrThumb:function(){},
      toLookedPage:function(){},
      toUserListPage:function(){},
    };
  },
  componentDidMount() {
    if(!this.props.user.id){
      this.queryRromServer();
    }
  },

  render() {
    if(!this.props.user){
      return false;
    }
    return (
      <View  style={styles.flexContainer}>
        <View style={styles.mainSection}>
          <Image source={{uri:this.props.user.photo}} style={styles.avatar}/>
          <View style={styles.userInfoBody}>
            <View style={styles.userInfoHeader}>
              <TouchableOpacity style={styles.userInfoView} onPress={() => this.toUserListPage("fans")}>
                <Text style={styles.numText} > {this.props.user.fans_count} </Text>
                <Text style={styles.strText} > FANS </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userInfoView} onPress={() => this.toUserListPage("fanned")}>
                <Text style={styles.numText} > {this.props.user.looks_count} </Text>
                <Text style={styles.strText} > FANNED </Text>
              </TouchableOpacity>
              <View style={styles.userInfoView}>
                <Text style={styles.numText} > {this.props.user.looks_count} </Text>
                <Text style={styles.strText} > LOOKS</Text>
              </View>
            </View>
            <View style={styles.addUserView} >
              <Text style={styles.addUserText}>{this.state.isFaned?"-":"+"}</Text>
            </View>

          </View>
        </View>

        <View style={{paddingBottom: 5}}></View>
        <View style={styles.mainSection}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.showImagListOrThumb("thumb")} style={styles.cell}>
            <Icon name="grid" color={this.state.isThumb?globalVariables.base:globalVariables.textBase} size={30}/>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => this.showImagListOrThumb("list")} style={styles.cell}>
              <Icon name="navicon-round" color={this.state.isThumb?globalVariables.textBase:globalVariables.base} size={30}/>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => this.toLookedPage("HYPED")} style={styles.cell}>
            <Icon name="speakerphone" color={globalVariables.textBase} size={30}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.toLookedPage("LOVED")} style={styles.cell}>
              <Icon name="ios-heart" color={globalVariables.textBase} size={30}/>
          </TouchableOpacity>
        </View>
     </View>
    );
  },
  showImagListOrThumb(type){
    var isThumb=type=='thumb'?true:false;
    this.setState({isThumb:isThumb});
    this.props.showImagListOrThumb(type);
  },
  toLookedPage(type){
    this.props.toLookedPage(type);
  },
  toUserListPage(type){
    this.props.toUserListPage(type);
  },

  queryRromServer() {
    globalVariables.queryRromServer(globalVariables.apiUserServer+(this.props.uid||this.props.user.id),this.processsResults);
  },
  processsResults(data) {
    if (!data) {
      this.setState({
        searchPending: false,
      });
      return;
    }
    this.setState({
      user: data,
      searchPending: false,
      uid:data.id
    });

    globalVariables.saveMeInfo(data.user.hyped_look_ids
      ,data.user.fanned_user_ids
      ,data.user
      ,()=>{
      });
  }
});

const styles = StyleSheet.create({
  mainSection: {
    flex: 1,
    flexDirection: 'row',
    // paddingBottom: 10,
    // alignItems: "center",
    justifyContent: 'flex-start',
  },
  flexContainer: {
      // 容器需要添加direction才能变成让子元素flex
      flexDirection: 'column',
      opacity:0.97,
      padding: 5,
      backgroundColor: globalVariables.background,
      // justifyContent: 'flex-start',
      // paddingTop: 84,
  },
  userInfoBody: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft:15,
  },
  userInfoHeader: {
    flexDirection: "row",
    alignItems: "center"
  },
  userInfoView:{
      flex:1,
      flexDirection: "column",
      alignItems:"center",
  },
  numText: {
    color:globalVariables.base,
    fontWeight:'600',
    // fontSize:12,
  },
  strText: {
    color:globalVariables.textBase,
    fontSize:12,
  },
  addUserView: {
    // width: width-200,
    height: 25,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: globalVariables.base,
    alignItems:'center',
    margin:20,

  },
  addUserText:{
    color:globalVariables.base,
    fontSize:16,
    // textAlign:"center",
  },
  userInfoText: {
    fontSize:12,
    // marginLeft:20,
    // marginRight:20,
    flexDirection: "row",
    color:globalVariables.textBase2,
  },
  avatar: {
    borderRadius: 40,
    width: 80,
    height: 80,
    marginRight: 5,
    marginLeft:10,
  },
  cell: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserInfo;
