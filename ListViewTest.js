import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ListView,
  Dimensions,
  RefreshControl
} from 'react-native';
import NavigationBar from './js/common/NavigationBar';
import Toast, { DURATION } from 'react-native-easy-toast'

var movieData = require('./movie.json').movies;

var pixWidth = Dimensions.get('window').width;

export default class ListViewTest extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(movieData),
      isLoading: true
    };
    this.onLoad();
  }
  renderButton(image) {
    return (
        <TouchableOpacity
            onPress={() => {
              this.props.navigator.pop();
            }}
        >
          <Image style={{width: 24, height: 24, margin: 8}} source={image}/>
        </TouchableOpacity>
    )
  }
  renderRow(item) {
    return <View style={styles.row}>
      <TouchableOpacity
          onPress={() => {
            this.toast.show('你单击了：' + item.title, DURATION.LENGTH_LONG);
          }}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.year}>{item.year}</Text>
      </TouchableOpacity>
    </View>
  }
  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return <View key={rowID} style={styles.line}></View>
  }
  renderFooter() {
    return <Image
        style={styles.image}
        resizeMode={'cover'}
        source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506070161159&di=eb199fce42873a836a537b26708d0e33&imgtype=0&src=http%3A%2F%2Fp4.qhmsg.com%2Ft0164f075fd4fee7ea1.jpg'}}
    />
  }
  onLoad() {
    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 2000)
  }
  render() {
    return (
        <View style={styles.container}>
          <NavigationBar
              title={'ListViewTest'}
              style={{backgroundColor: "darkcyan"}}
              statusBar={{backgroundColor: 'darkcyan'}}
              leftButton={this.renderButton(require('./res/images/ic_arrow_back_white_36pt.png'))}
              rightButton={this.renderButton(require('./res/images/ic_star.png'))}
          />
          <ListView
              dataSource={this.state.dataSource}
              renderRow={(item) => this.renderRow(item)}
              renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>
                  this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
              renderFooter={() => this.renderFooter()}
              refreshControl={<RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={() => this.onLoad()}
              />}
          />
          <Toast ref={toast => {this.toast = toast}}/>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  text: {
    fontSize: 20,
  },
  row: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    color: 'black'
  },
  year: {
    fontSize: 16
  },
  line: {
    height: 1,
    backgroundColor: 'black'
  },
  image: {
    width: pixWidth,
    height: 200
  }
})