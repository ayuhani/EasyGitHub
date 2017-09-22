import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import NavigationBar from './NavigatorBar';

export default class FetchTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: ''
    };
  }
  onLoad(url) {
    fetch(url)
        .then(response => response.json())
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
  onSubmit(url, params) {
    fetch(url, {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
        .then(response => response.json())
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
  render() {
    return (
        <View style={styles.container}>
          <NavigationBar
              title={'Fetch'}
              style={{backgroundColor: "darkcyan"}}
              statusBar={{backgroundColor: 'darkcyan'}}
           />
          <Text
              style={styles.text}
              onPress={() => {
                this.onLoad('http://rapapi.org/mockjsdata/26411/ayhani/get');
              }}
          >获取数据</Text>
          <Text
              style={styles.text}
              onPress={() => {
                this.onSubmit('http://rapapi.org/mockjsdata/26411/ayuhani/post',
                    {username: 'ayuhani', password: '123456'})
              }}
          >提交数据</Text>
          <Text style={styles.text}>返回结果：{this.state.result}</Text>
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
  }
})