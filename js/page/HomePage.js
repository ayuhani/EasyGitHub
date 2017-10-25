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
  DeviceEventEmitter,
  BackHandler
} from 'react-native';
import PopularPage from './PopularPage';
import TrendingPage from './TrendingPage';
import FavoritePage from './FavoritePage';
import MyPage from './my/MyPage';
import Toast, {DURATION} from 'react-native-easy-toast';
import BaseComponent from './BaseComponent';
import BackPressCommon from '../common/BackPressCommon';

export const ACTION_HOME = {
  FlAG: 'action_home',
  BASE: 'action_base',
  SHOW_TOAST: 'showToast',
  RESTART: 'restart',
  CHANGE_THEME: 'change_theme'
};
export const FLAG_TAB = {
  TB_POPULAR: 'tb_popular',
  TB_TRENDING: 'tb_trending',
  TB_FAVORITE: 'tb_favorite',
  TB_MY: 'tb_my'
};

export default class HomePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.backPress = new BackPressCommon({backPress: (e) => this.onBackPress(e)})
    let selectedTab = this.props.selectedTab ? this.props.selectedTab : FLAG_TAB.TB_POPULAR;
    this.state = {
      selectedTab: selectedTab,
      theme: this.props.theme,
    };
  }

  onBackPress(e) {
    // BackHandler.exitApp()
    return false;
  }

  componentDidMount() {
    super.componentDidMount();
    this.listener = DeviceEventEmitter.addListener(ACTION_HOME.FlAG, (action, params) => this.onAction(action, params));
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.listener && this.listener.remove();
    this.backPress.componentWillUnmount()
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
        selectedTab: jumpToTab,
        theme: this.state.theme
      }
    })
  }

  renderTab(Component, tabText, tabImg, topTitle) {
    return <TabNavigator.Item
        selected={this.state.selectedTab === tabText}
        title={topTitle}
        selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
        renderIcon={() => <Image style={styles.bottomImage}
                                 source={tabImg}/>}
        renderSelectedIcon={() => <Image style={[styles.bottomImage, this.state.theme.styles.tabBarSelectedIcon]}
                                         source={tabImg}/>}
        onPress={() => this.setState({selectedTab: tabText})}>
      <Component
          {...this.props}
          theme={this.state.theme}/>
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

