import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  WebView
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';

export default class WebPage extends Component {
  constructor(props) {
    super(props);
    this.text = '';
    this.state = {
      url: this.props.url,
      canGoBack: false,
      title: this.props.title
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
              title={this.state.title}
              leftButton={ViewUtil.getLeftButton(() => this.goBack())}
          />
          <WebView
              ref={webView => this.webView = webView}
              style={{flex: 1}}
              source={{uri: this.state.url}}
              onNavigationStateChange={this.onNavigationStateChange}
              startInLoadingState={true}
              javaScriptEnabled={true}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})