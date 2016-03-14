import React from 'react-native';
const {
  ScrollView,
  StyleSheet,
  Image,
  Text,
  View,
  MapView,
} = React;

import _ from 'lodash';
import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

import HouseDetailsCaroselImage from './HouseDetailsCaroselImage.js';
import SpecIconBox from './SpecIconBox.js';
import KVBox from './KVBox.js';

import SaveButton from './SaveButton.js';

import parse from '../parsing/index.js';

import globalVariables from '../globalVariables.js';


const HouseDetails = React.createClass({

  getInitialState() {
    return {
      searchPending: false,
      houseKV: {},
      images: null,
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    };
  },

  getDefaultProps() {
    return {
      form: {},
      house: {},
      houseKV: null,
      images: null,
    };
  },

  componentDidMount() {
    this.getRMLSDetail();
    this.geocodeAddress();
  },

// user: {
// "id": 2344575,
// "first_name": "Michelle",
// "last_name": "Madsen",
// "username": "takeaim",
// "created_at": "2012-11-12T02:19:04-05:00",
// "name": "Michelle M.",
// "byline": "Designer 来自 Los Angeles, United States",
// "byline_str": "Designer",
// "location_str": "United States",
// "photo": "http://cdn12.lbstatic.nu/files/users/large/2344575_DSC_8968.jpg?1381427695",
// "cover_photo_url": null,
// "karma_count": 79422,
// "looks_count": 383,
// "fans_count": 26328
// }
  getRMLSDetail() {
    console.log('get detail', this.props.house.id);
    this.setState({ searchPending: true });
    // http://api.lookbook.nu/v1/user/64838/looks?page=1&view=full
    // http://api.lookbook.nu/v1/user/64838
    fetch('http://api.lookbook.nu/v1/look/hot/'+(page||1)+'/?view=full',{
      method: 'get',
      headers: {
        "Host": "api.lookbook.nu",
        "Cookie":"_lookbook_session=BAh7CUkiD3Nlc3Npb25faWQGOgZFVEkiJTMzYzAxODNlMzdiNTVhYWYxMTUxY2NlNmJiZmEwMmY5BjsAVEkiEG1vYmlsZV92aWV3BjsARkZJIgpnZW9pcAY7AEZ7DToRY291bnRyeV9jb2RlIgdjbjoSY291bnRyeV9jb2RlMyIIQ0hOOhFjb3VudHJ5X25hbWUiCkNoaW5hOgtyZWdpb24iBzAyOhByZWdpb25fbmFtZSINWmhlamlhbmc6CWNpdHkiDUhhbmd6aG91Og1sYXRpdHVkZWYWMzAuMjkzNjAwMDgyMzk3NDY6DmxvbmdpdHVkZWYWMTIwLjE2MTM5OTg0MTMwODZJIgtsb2NhbGUGOwBGSSIHY24GOwBU--29e77b70102f412d9bec0be23095aec47b646ac2",
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "Lookbook/1.7.3 CFNetwork/711.3.18 Darwin/14.0.0",
        "Accept-Encoding":"gzip, deflate",
        "Connection":"keep-alive"
      }
    })
    .then((response) => response.text())
    .then((responseText) => {
      console.log('GOT RMLS DETAIL');
      // console.log(responseText);

      this.processResults(responseText);
    })
    .catch(function (error) {
      console.error('An error occured');
      console.error(error.message);
    });
  },

  processResults(data) {

    this.setState({
      houseKV: data.house,
      searchPending: false,
      form: data.form
    });

    if (data.photosID) this.getRMLSImages(data.photosID);
  },





  getRMLSImages(photosID) {
    console.log('get images', photosID);
    this.setState({ searchPending: true });

    fetch('http://www.rmls.com/RC2/UI/photoViewer.asp?ml=' + photosID, {
      method: 'get',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.104 Safari/537.36",
        "Referer": "http://www.rmls.com/rc2/UI/search_residential.asp",
      }
    })
    .then((response) => response.text())
    .then((responseText) => {
      console.log('GOT RMLS IMAGES');
      // console.log(responseText);

      this.processImageResults(responseText);
    })
    .catch(function (error) {
      console.error('An error occured');
      console.error(error.message);
    });
  },

  processImageResults(html) {
    const data = parse.housePhotos(html);
    // console.log(data);

    this.setState({
      images: data,
      searchPending: false
    });
  },


  geocodeAddress(address) {
    fetch(globalVariables.geocodeServer + '?address='+encodeURIComponent(address))
    .then((response) => response.json())
    .then((response) => {
      console.log(response);

      if (!_.isArray(response.results)) return;

      const location = response.results[0].geometry.location;

      this.setState({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })
    .catch(function (error) {
      console.error('An error occured');
      console.error(error.message);
    });
  },


  render() {

    return (
      // ListView wraps ScrollView and so takes on its properties.
      // With that in mind you can use the ScrollView's contentContainerStyle prop to style the items.
      <ListView
        contentContainerStyle={styles.list}
        dataSource={this.state.dataSource}
        initialListSize={21}
        pageSize={3} // should be a multiple of the no. of visible cells per row
        scrollRenderAheadDistance={500}
        renderRow={this._renderRow}
      />
    );
  },

  _renderRow: function(rowData: string, sectionID: number, rowID: number) {
    var rowHash = Math.abs(hashCode(rowData));
    var imgSource = THUMB_URLS[rowHash % THUMB_URLS.length];
    return (
      <TouchableHighlight onPress={() => this._pressRow(rowID)} underlayColor="transparent">
        <View>
          <View style={styles.row}>
            <Image style={styles.thumb} source={imgSource} />
            <Text style={styles.text}>
              {rowData}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalVariables.background,
  },

  map: {
    height: 150,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  // CAROSEL
  carosel: {
    width,
    height: 245,
    // borderColor: 'red',
    // borderWidth: 1
  },


  // PRICE
  priceContainer: {
    position: 'absolute',
    backgroundColor: globalVariables.green,
    padding: 5,
    top: 190,
    left: 0,
    height: 30,
    shadowColor: 'black',
    shadowOffset: {height: 2, width: 1  },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },

  priceText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // ADDRESS BOX
  addressContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    shadowColor: 'black',
    shadowOffset: {height: 2, width: 1  },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  addressText: {
    color: globalVariables.textColor,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center'
  },

  mapPin: {
    width: 10,
    height: 17,
    margin: 5
  },


  // ICON BOX
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },


  // DESC BOX
  descContainer: {
    padding: 20
  },

  descLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: globalVariables.textColor
  },

  descText: {
    fontSize: 14,
    fontWeight: '200',
    color: globalVariables.textColor,
    lineHeight: 20
  },


  // KV BOX
  kvContainer: {
    padding: 20,
    paddingTop: 0,
  },
});

export default HouseDetails;
