import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  WebView,
  TextInput,
  DeviceEventEmitter
} from 'react-native';
import NavigationBar from './js/common/NavigationBar';

const URL = 'https://www.imooc.com';

export default class WebViewTest extends Component {
  constructor(props) {
    super(props);
    this.text = '';
    this.state = {
      url: URL,
      canGoBack: false
    };
  }

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack
    })
  }

  goBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
      return;
    }
    DeviceEventEmitter.emit('showToast', '到顶了');
  }

  go() {
    this.setState({
      url: this.text
    })
  }

  render() {
    return (
        <View style={styles.container}>
          <NavigationBar
              title={'WebViewTest'}
          />
          <View style={styles.header}>
            <Text
                style={styles.text}
                onPress={() => {
                  this.goBack()
                }}
            >返回</Text>
            <TextInput
                style={{height: 40, flex: 1}}
                defaultValue={URL}
                onChangeText={text => this.text = text}
            />
            <Text
                style={styles.text}
                onPress={() => {
                  this.go();
                }}
            >前往</Text>
          </View>
          <WebView
              ref={webView => this.webView = webView}
              style={{flex: 1}}
              source={{uri: this.state.url}}
              onNavigationStateChange={this.onNavigationStateChange}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
  header: {
    flexDirection: 'row'
  },
  text: {
    fontSize: 20,
    margin: 8
  }
})