import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  WebView,
  TextInput,
  DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';

const TRENDING_URL = 'https://www.github.com/';

export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canGoBack: false,
      title: this.props.item.full_name ? this.props.item.full_name : this.props.item.fullName,
      url: this.props.item.html_url ? this.props.item.html_url : TRENDING_URL + this.props.item.fullName
    }
  }

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack,
      //title: navState.title
    })
  }

  goBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
      return;
    }
    this.props.navigator.pop();
  }

  render() {
    return (
        <View style={styles.container}>
          <NavigationBar
              title={this.state.title}
              leftButton={ViewUtil.getLeftButton(() => this.goBack())}
          />
          <WebView
              ref={webView => this.webView = webView}
              style={{flex: 1}}
              source={{uri: this.state.url}}
              onNavigationStateChange={this.onNavigationStateChange}
              startInLoadingState={true}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row'
  },
  text: {
    fontSize: 20,
    margin: 8
  }
})