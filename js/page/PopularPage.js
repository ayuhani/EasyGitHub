import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import NavigationBar from '../common/NavigatorBar';
import DataRepository from '../expand/dao/DataRepository';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.dataRepository = new DataRepository();
    this.state = {
      result: ''
    };
  }

  onLoad() {
    let url = this.getUrl(this.text);
    this.dataRepository.fetchNetRepository(url)
        .then(result => {
          this.setState({
            result: JSON.stringify(result)
          })
        })
        .catch(error => {
          this.setState({
            result: JSON.stringify(error)
          })
        })
  }

  getUrl(key: string) {
    return URL + key + QUERY_STR;
  }

  render() {
    return (
        <View style={styles.container}>
          <NavigationBar
              title={'最热'}
              style={{backgroundColor: "gray"}}
              statusBar={{backgroundColor: 'gray'}}
          />
          <Text
              onPress={() => {
                this.onLoad();
              }}
              style={styles.text}>获取数据</Text>
          <TextInput
              style={{height: 40}}
              onChangeText={(text) => this.text = text}
          />
          <Text>{this.state.result}</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 20,
  }
})