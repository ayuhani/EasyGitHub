/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import TabNavigator from 'react-native-tab-navigator';
import {
  StyleSheet,
  View,
  Image,
  DeviceEventEmitter
} from 'react-native';
import PopularPage from './PopularPage';
import MyPage from './my/MyPage';
import Toast, {DURATION} from 'react-native-easy-toast';
import WebViewTest from '../../WebViewTest';
import TrendingPage from './TrendingPage';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'tb_popular',
    };
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
      this.toast.show(text, DURATION.LENGTH_SHORT);
    })
  }

  componentWillUnmount() {
    this.listener && this.listener.remove();
  }

  renderTab(Component, tabText, tabImg, topTitle) {
    return <TabNavigator.Item
        selected={this.state.selectedTab === tabText}
        title={topTitle}
        selectedTitleStyle={{color: '#2196f3'}}
        renderIcon={() => <Image style={styles.bottomImage}
                                 source={tabImg}/>}
        renderSelectedIcon={() => <Image style={[styles.bottomImage, {tintColor: '#2196f3'}]}
                                         source={tabImg}/>}
        onPress={() => this.setState({selectedTab: tabText})}>
      <Component {...this.props}/>
    </TabNavigator.Item>;
  }

  render() {
    return (
        <View style={styles.container}>
          <TabNavigator>
            {this.renderTab(PopularPage, 'tb_popular', require('../../res/images/ic_polular.png'), '最热')}
            {this.renderTab(TrendingPage, 'tb_trending', require('../../res/images/ic_trending.png'), '趋势')}
            {this.renderTab(WebViewTest, 'tb_favorite', require('../../res/images/ic_favorite.png'), '收藏')}
            {this.renderTab(MyPage, 'tb_my', require('../../res/images/ic_my.png'), '我的')}
          </TabNavigator>
          <Toast ref={toast => this.toast = toast}/>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  page1: {
    flex: 1,
    backgroundColor: 'cyan'
  },
  page2: {
    flex: 1,
    backgroundColor: 'green'
  },
  bottomImage: {
    width: 24,
    height: 24
  }
});

