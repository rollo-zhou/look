
import React from 'react';
import {
    AppRegistry,
    Text,
    View,
    ListView,
    StyleSheet,
    } from 'react-native';


//要求原数组是一个对象数组，对象下面还有一个子数组，方便转换
var mockData = [
  {
    id:"aaa",
    sub: Array(11).fill(1).map((el, index) => {
      return "first " + index
    })
  },
]


const List = React.createClass({

    getInitialState() {
      //转换为一个一维对象数组
        var convertToObject = (array) => {
          var dataBlob = {},
          sectionIDs = [],
          rowIDs = []
          sectionIDs = array.map((el, index) => {
              var sid = el.id
              dataBlob[sid] = el
              rowIDs[index] = el.sub.map((elem) => {
                  var key = el.id +":"+elem
                  dataBlob[key] = elem
                  return key
              })
              return sid
          })
          return {
            dataBlob: dataBlob,//一个对象
            sectionIDs: sectionIDs,// 一个一维数组 [string|number, string|number, string|number ...]
            rowIDs: rowIDs // 一个二维数组，［［string|number］，［string|number］，［string|number］...］
          }
      }

      var {
        dataBlob,
        sectionIDs,
        rowIDs,
      } = convertToObject(mockData)


      var getSectionData = (dataBlob, sectionID) => {
          return dataBlob[sectionID];
      }

      var getRowData = (dataBlob, sectionID, rowID) => {
          //console.log(dataBlob, sectionID, rowID)
          return dataBlob[rowID];
      }


      var source = new ListView.DataSource({//这是定义结构
          getSectionData          : getSectionData,
          getRowData              : getRowData,
          rowHasChanged           : (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged : (s1, s2) => s1 !== s2
      }).cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)//这是添加数据

      return {
            dataSource : source
       }
    },

    renderRow(rowData, sectionID, rowID) {

        return (
                <View style={styles.row}>
                    <Text style={styles.rowText}>{rowData}</Text>
                </View>
        );
    },


    renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionText}>{sectionData.id}</Text>
            </View>
        );
    },

    render() {
        return (
          <View style={styles.container}>
              <View style={styles.header}>
                  <Text style={styles.headerText}>ListView的section sticky效果</Text>
              </View>
              <ListView
                  dataSource = {this.state.dataSource}
                  style={styles.list}
                  renderRow  = {this.renderRow}
                  renderSectionHeader = {this.renderSectionHeader}
              />
          </View>
        )
    }

});


const styles = StyleSheet.create({
  container: {
    flex: 1,
},
list:{

},

header: {
    height: 60,

},

headerText: {

    color: "white",
},

section: {

    padding: 6,

},

sectionText: {
  color: "red",

},


row:{

},
rowText: {
    color: "#468847",
    fontSize: 16,
}
});

export default List;
