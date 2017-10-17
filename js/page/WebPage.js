import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  WebView,
  ActivityIndicator
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';

const THEME_COLOR = '#2196f3';

export default class WebPage extends Component {
  constructor(props) {
    super(props);
    this.text = '';
    this.state = {
      isLoading: true,
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
          <View style={styles.container}>
            <WebView
                ref={webView => this.webView = webView}
                style={{flex: 1}}
                source={{uri: this.state.url}}
                onNavigationStateChange={this.onNavigationStateChange}
                javaScriptEnabled={true}
                onLoadEnd={() => this.setState({isLoading: false})}
            />
            <ActivityIndicator
                style={styles.indicator}
                animating={this.state.isLoading}
                color={THEME_COLOR}
                size={'large'}
            />
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
})