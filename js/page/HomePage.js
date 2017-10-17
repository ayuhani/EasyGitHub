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
import TrendingPage from './TrendingPage';
import FavoritePage from './FavoritePage';
import MyPage from './my/MyPage';
import Toast, {DURATION} from 'react-native-easy-toast';

export const ACTION_HOME = {FlAG: 'action_home', SHOW_TOAST: 'showToast', RESTART: 'restart'};
export const FLAG_TAB = {
  TB_POPULAR: 'tb_popular',
  TB_TRENDING: 'tb_trending',
  TB_FAVORITE: 'tb_favorite',
  TB_MY: 'tb_my'
};

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    let selectedTab = this.props.selectedTab ? this.props.selectedTab : FLAG_TAB.TB_POPULAR;
    this.state = {
      selectedTab: selectedTab,
    };
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener(ACTION_HOME.FlAG, (action, params) => this.onAction(action, params));
  }

  /**
   * 通知事件回调处理
   * @param action
   * @param params
   */
  onAction(action, params) {
    switch (action) {
      case ACTION_HOME.SHOW_TOAST:
        this.toast.show(params.text, DURATION.LENGTH_SHORT);
        break;
      case ACTION_HOME.RESTART:
        this.onRestart(params.jumpToTab);
        break;
    }
  }

  onRestart(jumpToTab) {
    // 跳转到新的场景，并且重置整个路由栈
    this.props.navigator.resetTo({
      component: HomePage,
      params: {
        ...this.props,
        selectedTab: jumpToTab
      }
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
            {this.renderTab(PopularPage, FLAG_TAB.TB_POPULAR, require('../../res/images/ic_polular.png'), '最热')}
            {this.renderTab(TrendingPage, FLAG_TAB.TB_TRENDING, require('../../res/images/ic_trending.png'), '趋势')}
            {this.renderTab(FavoritePage, FLAG_TAB.TB_FAVORITE, require('../../res/images/ic_favorite.png'), '收藏')}
            {this.renderTab(MyPage, FLAG_TAB.TB_MY, require('../../res/images/ic_my.png'), '我的')}
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

