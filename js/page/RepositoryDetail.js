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

export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.props.navigator.pop();
  }

  render() {
    return (
        <View style={styles.container}>
          <NavigationBar
              title={this.props.item.name}
              leftButton={ViewUtil.getLeftButton(() => this.goBack())}
          />
          <WebView
              ref={webView => this.webView = webView}
              style={{flex: 1}}
              source={{uri: this.props.item.html_url}}
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